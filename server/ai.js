import fs from "fs/promises";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FormData from "form-data";
import fetch from "node-fetch";

class ProductImageScanner {
  constructor(config) {
    this.geminiApiKey = config.geminiApiKey;
    this.backendUrl = config.backendUrl;
    this.jwtToken = config.jwtToken;
    this.imagesRootPath = config.imagesRootPath;
    this.defaultCategoryId =
      config.defaultCategoryId || "684d02ce88b46b39fb4fc009";
    this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  // Get all image files from a directory
  async getImagesFromDirectory(dirPath) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    try {
      const files = await fs.readdir(dirPath);
      return files
        .filter((file) =>
          imageExtensions.includes(path.extname(file).toLowerCase())
        )
        .map((file) => path.join(dirPath, file));
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return [];
    }
  }

  // Convert image file to base64
  async imageToBase64(imagePath) {
    try {
      const imageBuffer = await fs.readFile(imagePath);
      return {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: this.getMimeType(imagePath),
        },
      };
    } catch (error) {
      console.error(`Error converting image ${imagePath} to base64:`, error);
      return null;
    }
  }

  // Get MIME type based on file extension
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };
    return mimeTypes[ext] || "image/jpeg";
  }

  // Enhanced JSON parsing with robust error handling
  async parseGeminiResponse(text) {
    try {
      // Step 1: Remove all markdown code blocks and trim whitespace
      let jsonString = text.replace(/```(json)?/g, "").trim();

      // Step 2: Find the first complete JSON object in the response
      let jsonStart = jsonString.indexOf("{");
      let jsonEnd = jsonString.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No JSON object found in response");
      }

      jsonString = jsonString.slice(jsonStart, jsonEnd);

      // Step 3: Multiple parsing attempts with progressive cleaning
      const parsingAttempts = [
        // Attempt 1: Try parsing as-is first
        (str) => JSON.parse(str),

        // Attempt 2: Fix common JSON issues
        (str) =>
          JSON.parse(
            str
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
              .replace(/:([^"\s{}\[\],]+)([,}\]])/g, ':"$1"$2')
              .replace(/,(?=\s*[}\]])/g, "")
          ),

        // Attempt 3: More aggressive cleaning
        (str) => {
          // Remove any text before first { and after last }
          let cleanStr = str.slice(str.indexOf("{"), str.lastIndexOf("}") + 1);
          // Fix unquoted keys and values
          cleanStr = cleanStr
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
            .replace(/:\s*([^"{\[\d][^,}\]\s]*)([,\]}])/g, ': "$1"$2');
          return JSON.parse(cleanStr);
        },

        // Final attempt: Complete reconstruction if needed
        (str) => {
          const reconstructed = {};
          const nameMatch = str.match(/"name"\s*:\s*"([^"]+)"/);
          const descMatch = str.match(/"description"\s*:\s*"([^"]+)"/);
          const priceMatch = str.match(/"price"\s*:\s*(\d+\.?\d*)/);
          const offerMatch = str.match(/"offerPrice"\s*:\s*(\d+\.?\d*)/);
          const categoryMatch = str.match(/"category"\s*:\s*"([^"]+)"/);

          if (nameMatch) reconstructed.name = nameMatch[1];
          if (descMatch) reconstructed.description = descMatch[1];
          if (priceMatch) reconstructed.price = parseFloat(priceMatch[1]);
          if (offerMatch) reconstructed.offerPrice = parseFloat(offerMatch[1]);
          if (categoryMatch) reconstructed.category = categoryMatch[1];

          if (!reconstructed.name || !reconstructed.description) {
            throw new Error("Could not reconstruct essential fields");
          }

          return reconstructed;
        },
      ];

      let lastError = null;
      for (const attempt of parsingAttempts) {
        try {
          return attempt(jsonString);
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      throw lastError;
    } catch (error) {
      console.error("JSON parsing failed. Original text:", text);
      throw new Error(
        `JSON parsing failed after all attempts: ${error.message}`
      );
    }
  }

  // Generate product details using Gemini AI
  async generateProductDetails(imagePaths) {
    try {
      console.log(
        `Analyzing ${imagePaths.length} images for product details...`
      );

      // Convert all images to base64
      const imagePromises = imagePaths.map((path) => this.imageToBase64(path));
      const images = (await Promise.all(imagePromises)).filter(Boolean);

      if (images.length === 0) {
        throw new Error("No valid images found");
      }

      const prompt = `
Analyze these product images thoroughly and provide comprehensive information in STRICT JSON format.
Examine ALL images carefully to understand every aspect of the product.

Provide EXTREMELY DETAILED information in this EXACT structure:
{
    "name": "Creative, marketable product name (3-5 words max)",
    "description": "Extremely comprehensive product description (MUST be 400-500 words) covering ALL these aspects:
        - Detailed physical description (colors, dimensions, materials, weight)
        - Precise technical specifications (if applicable)
        - Build quality and durability assessment
        - Design philosophy and aesthetic qualities
        - Exact features and functionalities
        - Included accessories/components
        - Brand heritage/reputation (if visible)
        - Target demographic and ideal use cases
        - Competitive advantages
        - Care/maintenance requirements
        - Warranty/guarantee information (if visible)
        - Any certifications (CE, FCC, etc. if visible)
        - Environmental/eco-friendly aspects
        - Packaging contents
        - Comparison to similar products
        - 5+ unique selling points
        - 3+ ideal usage scenarios",
    "price": 199.99 (REALISTIC market price in USD),
    "offerPrice": 169.99 (EXACT 15-25% discount applied),
    "category": "Most specific applicable category"
}

STRICT RULES:
        1. No markdown formatting
        2. No additional text outside the JSON
        3. Escape all special characters
        4. Use double quotes only
        `;

      const result = await this.model.generateContent([prompt, ...images]);
      const response = await result.response;
      const text = response.text();

      console.log("Raw API response:", text); // Debug logging

      // Parse with enhanced handler
      const productData = await this.parseGeminiResponse(text);

      // Validate response structure
      const requiredFields = [
        "name",
        "description",
        "price",
        "offerPrice",
        "category",
      ];
      for (const field of requiredFields) {
        if (!productData[field])
          throw new Error(`Missing required field: ${field}`);
      }

      // Clean description
      productData.description = productData.description
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"');

      // Ensure description length
      if (productData.description.split(/\s+/).length < 300) {
        productData.description = await this.expandDescription(
          productData.description
        );
      }

      productData.category_id = this.getCategoryId(productData.category);

      // 💡 Inject randomized pricing
      const priceRanges = {
        Electronics: [200, 1500],
        Fashion: [10, 100],
        Furnitures: [100, 1000],
        Grocery: [1, 50],
        Appliances: [50, 800],
        Cosmetics: [5, 200],
      };

      const [min, max] = priceRanges[productData.category] || [20, 100];
      const newPrice = Math.random() * (max - min) + min;
      productData.price = parseFloat(newPrice.toFixed(2));

      const discount = Math.random() * 0.1 + 0.15; // 15% to 25%
      productData.offerPrice = parseFloat(
        (productData.price * (1 - discount)).toFixed(2)
      );

      return productData;
    } catch (error) {
      console.error("Product details generation failed:", error);
      throw error;
    }
  }

  // Expand short descriptions
  async expandDescription(shortDescription) {
    const expansionPrompt = `
      Expand this product description to 400-500 words while maintaining accuracy.
      Add technical specifications, usage scenarios, and competitive advantages.
      Return ONLY the expanded description with no other text or formatting.
      
      Current description: ${shortDescription}
    `;

    const result = await this.model.generateContent(expansionPrompt);
    return (await result.response).text();
  }

  // Map category names to category IDs
  getCategoryId(categoryName) {
    const categoryMap = {
      Electronics: "684d02ce88b46b39fb4fc009",
      Fashion: "684d02ce88b46b39fb4fc00a",
      Furnitures: "684d02ce88b46b39fb4fc00b",
      Grocery: "684d02ce88b46b39fb4fc00c",
      Appliances: "684d02ce88b46b39fb4fc00d",
      Cosmetics: "684d02ce88b46b39fb4fc00e",
    };
    return categoryMap[categoryName] || this.defaultCategoryId;
  }

  // Add product to backend API
  async addProductToBackend(productData, imagePaths) {
    try {
      const formData = new FormData();

      // Add all images with field name "image"
      for (const imagePath of imagePaths) {
        const imageBuffer = await fs.readFile(imagePath);
        formData.append("image", imageBuffer, {
          filename: path.basename(imagePath),
          contentType: this.getMimeType(imagePath),
        });
      }

      // Add product data as JSON string
      formData.append(
        "productData",
        JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          offerPrice: productData.offerPrice,
          category_id: productData.category_id,
        })
      );

      const response = await fetch(`${this.backendUrl}/api/product/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwtToken}`,
          Cookie: `token=${this.jwtToken}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding product to backend:", error);
      throw error;
    }
  }

  // Process a single product folder
  async processProductFolder(folderPath) {
    try {
      const folderName = path.basename(folderPath);
      console.log(`\n📁 Processing folder: ${folderName}`);

      const imagePaths = await this.getImagesFromDirectory(folderPath);
      if (imagePaths.length === 0) {
        console.log(`⚠️ No images found in ${folderName}`);
        return null;
      }

      console.log("🤖 Generating product details...");
      const productData = await this.generateProductDetails(imagePaths);

      console.log("💾 Uploading to backend...");
      const result = await this.addProductToBackend(productData, imagePaths);

      console.log(`✅ Successfully added product: ${productData.name}`);
      return result;
    } catch (error) {
      console.error(
        `❌ Failed to process folder ${path.basename(folderPath)}:`,
        error.message
      );
      return null;
    }
  }

  // Scan and process all product folders
  async scanAndProcessProducts() {
    try {
      console.log("🚀 Starting product scanning...");
      console.log(`📂 Root directory: ${this.imagesRootPath}`);

      const items = await fs.readdir(this.imagesRootPath, {
        withFileTypes: true,
      });
      const productFolders = items
        .filter((item) => item.isDirectory())
        .map((item) => path.join(this.imagesRootPath, item.name));

      if (productFolders.length === 0) {
        console.log("⚠️ No product folders found!");
        return;
      }

      let successCount = 0;
      for (const folderPath of productFolders) {
        const result = await this.processProductFolder(folderPath);
        if (result) successCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      console.log(
        `\n🎉 Done! Successfully processed ${successCount}/${productFolders.length} products`
      );
    } catch (error) {
      console.error("❌ Error in scanAndProcessProducts:", error);
      throw error;
    }
  }
}

// Configuration
const config = {
  geminiApiKey: "AIzaSyAb5VHMD46LN5XeGWFaccBeslM5tijk9eU",
  backendUrl: "http://localhost:3000",
  jwtToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTRlZjBiODAwMjM4Y2UyN2MwNjIzMSIsImlhdCI6MTc1MDM5NjY4MywiZXhwIjoxNzUxMDAxNDgzfQ.74UrgZuY5lWaHLk4yME1o2pcOwUVEaYM4Bg23M4GmWA",
  imagesRootPath: "./products",
  defaultCategoryId: "684d02ce88b46b39fb4fc00c",
};

// Run the script
(async () => {
  try {
    const scanner = new ProductImageScanner(config);
    await scanner.scanAndProcessProducts();
  } catch (error) {
    console.error(" Fatal error:", error);
    process.exit(1);
  }
})();
