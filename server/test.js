console.log("✅ Node.js is working");
console.log("📦 Checking imports...");

try {
  import("fs/promises").then(() => console.log("✅ fs/promises imported"));
  import("@google/generative-ai").then(() =>
    console.log("✅ Gemini AI imported")
  );
  import("form-data").then(() => console.log("✅ form-data imported"));
  import("node-fetch").then(() => console.log("✅ node-fetch imported"));
} catch (error) {
  console.error("❌ Import error:", error.message);
}
