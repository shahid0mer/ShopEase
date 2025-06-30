import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import razorpay from "../configs/razorpay.js";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Cart from "../models/Cart.js";
// Create order - online payment : /api/order/create
export const createOrder = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { items, address, payment_id, paymentType } = req.body;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = await items.reduce(async (total, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      return (await total) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // tax calculation

    const addressDoc = await Address.create({
      user_id,
      ...address,
    });

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        return {
          product_id: item.product,
          quantity: item.quantity,
          seller_id: product.seller_id, // include seller_id from DB
        };
      })
    );

    const order = await Order.create({
      user_id,
      products,
      paymentType,
      payment_id,
      amount,
      shippingAddress: addressDoc._id,
      ispaid: paymentType === "ONLINE" ? true : false,
    });

    res.json({
      success: true,
      message: "Order created successfully",
      order_id: order._id,
      amount,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all orders for the user : /api/order/user
export const getUserOrder = async (req, res) => {
  try {
    const user_id = req.user._id;

    const orders = await Order.find({
      user_id,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "products.product_id",

        select: "name price offerPrice images",
      })
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID for user : /api/order/:order_id
export const getOrderById = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { order_id } = req.params;

    const order = await Order.findOne({
      _id: order_id,
      user_id,
    })
      .populate("products.product_id")
      .populate("shippingAddress");

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Track Order : /api/order/track/:order_id
export const trackOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user._id;

    const order = await Order.findOne({
      _id: order_id,
      user_id,
    }).select("status createdAt updatedAt trackingInfo");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      tracking: {
        order_id: order._id,
        status: order.status,
        ordered_at: order.createdAt,
        last_updated: order.updatedAt,
        tracking_info:
          order.trackingInfo || "No tracking information available",
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Order : /api/order/cancel/:order_id
export const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user._id;

    const order = await Order.findOne({
      _id: order_id,
      user_id,
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("Order status:", order.status);

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place order with COD : /api/order/place-cod
export const placeOrderCOD = async (req, res) => {
  try {
    const user_id = req.user._id;
    // 'items' will be an array like: [{ product: 'productId1', quantity: 1 }]
    // 'address' will be the full selected address object from the frontend, including its _id
    const { items, address } = req.body;

    if (!address || !address._id || !items || items.length === 0) {
      // Ensure address._id is present
      return res.status(400).json({
        success: false,
        message: "Invalid order data: Missing address or items.",
      });
    }

    let totalAmount = 0;
    const productsForOrder = []; // This will store product details including seller_id

    // Iterate through items to calculate total amount and build the products array for the order
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.product}`);
      }

      // *** CRITICAL FIX: Reference product.seller_id as per your Product schema ***
      if (!product.seller_id) {
        // Check for the correct field name
        throw new Error(
          `Product (ID: ${item.product}) is missing a seller ID. Cannot place order.`
        );
      }

      // Use offerPrice if available, otherwise price. Ensure it's a number.
      const itemPrice = product.offerPrice || product.price || 0;
      totalAmount += itemPrice * item.quantity;

      productsForOrder.push({
        product_id: item.product,
        quantity: item.quantity,
        seller_id: product.seller_id, // *** Corrected to product.seller_id ***
      });
    }

    // Round to 2 decimal places before tax
    totalAmount = Math.round(totalAmount * 100) / 100;
    // Add tax and round again
    totalAmount += Math.round(totalAmount * 0.02 * 100) / 100;

    // We do NOT create a new address here.
    // We assume the 'address' object passed from the frontend (selectedAddress)
    // already has an '_id' which references an existing address document.

    await Order.create({
      user_id,
      products: productsForOrder, // Use the new array with seller_id
      paymentType: "COD",
      amount: totalAmount, // Use the calculated total amount
      shippingAddress: address._id, // Use the _id of the existing selected address
      status: "Pending", // Set initial status for COD orders
    });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error.message); // Use console.error for errors
    return res.status(500).json({
      success: false,
      message: "Failed to place order: " + error.message,
    });
  }
};

export const singleProductCheckout = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { productId, quantity, address, paymentType } = req.body;

    // Step 1: Basic request validation
    if (!productId || !quantity || !address || !paymentType) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID, quantity, address, and payment type are required.",
      });
    }

    // Determine the shippingAddressId:
    let shippingAddressId;
    if (address._id) {
      // If address object has an _id, it's an existing address. Use its _id directly.
      shippingAddressId = address._id;
    } else {
      // If no _id, assume it's a new address and create it.
      const { name, phone, addressLine1, city, state, country, pincode } =
        address;
      if (
        !name ||
        !phone ||
        !addressLine1 ||
        !city ||
        !state ||
        !country ||
        !pincode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Address validation failed: name, phone, addressLine1, city, state, country, and pincode are required for a new address.",
        });
      }
      const addressDoc = await Address.create({
        user_id,
        name,
        phone,
        addressLine1,
        addressLine2: address.addressLine2 || "",
        city,
        state,
        country,
        pincode,
      });
      shippingAddressId = addressDoc._id;
    }

    // Step 2: Get product and calculate total
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Ensure seller_id exists on the product before using it
    if (!product.seller_id) {
      throw new Error(
        `Product (ID: ${productId}) is missing a seller ID. Cannot proceed with order.`
      );
    }

    const basePrice = product.offerPrice || product.price || 0;
    // Calculate amount including 2% tax, rounded to 2 decimal places (in rupees/dollars)
    const amountInCurrency =
      Math.round(basePrice * quantity * 1.02 * 100) / 100;

    if (paymentType === "ONLINE") {
      // --- FIX: Generate a shorter unique receipt ID for Razorpay ---
      // Using last 8 chars of user_id and last 8 chars of timestamp
      const shortUserId = user_id.toString().slice(-8);
      const shortTimestamp = Date.now().toString().slice(-8);
      const receiptId = `order_${shortUserId}_${shortTimestamp}`; // Example: order_d2461974_12345678 (approx 25 chars)

      const razorpayOptions = {
        amount: amountInCurrency * 100, // Razorpay expects amount in paise/cents
        currency: "INR", // Ensure this matches your Razorpay setup
        receipt: receiptId, // Use the new, shorter receipt ID
        notes: {
          userId: user_id.toString(),
          productId: productId.toString(),
          quantity: quantity.toString(),
          shippingAddressId: shippingAddressId.toString(),
        },
      };

      try {
        const razorpayOrder = await razorpay.orders.create(razorpayOptions);

        return res.json({
          success: true,
          requiresPayment: true,
          paymentData: {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
          message: "Razorpay order initiated. Awaiting payment.",
        });
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", razorpayError);
        // Log the full Razorpay error for better debugging
        console.error("Razorpay Error Details:", razorpayError.error);
        return res.status(500).json({
          success: false,
          message: "Failed to initiate online payment with Razorpay.",
        });
      }
    } else if (paymentType === "COD") {
      const order = await Order.create({
        user_id,
        products: [
          {
            product_id: productId,
            quantity,
            seller_id: product.seller_id,
          },
        ],
        paymentType: "COD",
        amount: amountInCurrency,
        shippingAddress: shippingAddressId,
        status: "Pending",
        isPaid: false,
      });

      return res.json({
        success: true,
        requiresPayment: false,
        message: "Order created successfully (COD)",
        order: order,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment type provided." });
    }
  } catch (error) {
    console.error("Single product checkout error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred during checkout.",
    });
  }
};

export const cartCheckout = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated and req.user is available
    const { products, shippingAddress, paymentType } = req.body;

    console.log(
      "🛒 Incoming cart checkout request body (initial) =>",
      req.body
    );
    console.log("User ID:", userId);

    if (!shippingAddress || !Array.isArray(products) || products.length === 0) {
      console.error("Validation Error: Missing address or items in cart.");
      return res.status(400).json({
        success: false,
        message: "Missing delivery address or items in cart.",
      });
    }

    // Fetch actual product data from DB to validate prices and calculate total (server-side calculation)
    let backendSubtotalDollars = 0;
    const populatedItems = [];

    console.log(
      "--- Initial Backend Product Price Calculation for Razorpay Order Creation ---"
    );
    for (const item of products) {
      try {
        const product = await Product.findById(item.product_id);
        if (!product) {
          console.error(
            `Product Not Found Error: Product with ID ${item.product_id} not found.`
          );
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.product_id} not found.`,
          });
        }
        const itemPrice = parseFloat(product.offerPrice || product.price || 0);
        const itemTotal = itemPrice * item.quantity;

        backendSubtotalDollars += itemTotal;

        populatedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: itemPrice,
          seller_id: item.seller_id,
        });
        console.log(
          `Product ID: ${item.product_id}, DB Price: $${itemPrice.toFixed(
            2
          )}, Qty: ${item.quantity}, Item Total: $${itemTotal.toFixed(2)}`
        );
      } catch (productFetchError) {
        console.error(
          `Error fetching product ${item.product_id}:`,
          productFetchError
        );
        return res.status(500).json({
          success: false,
          message: `Error processing product ${item.product_id}.`,
        });
      }
    }
    console.log(
      `Calculated Subtotal (before tax, in dollars): $${backendSubtotalDollars.toFixed(
        2
      )}`
    );

    // --- ALIGNED CALCULATION WITH FRONTEND AND VERIFICATION FUNCTION ---
    const subtotalPaiseBackend = Math.round(backendSubtotalDollars * 100);
    console.log(
      `Backend Subtotal in Paise (rounded from dollars): ${subtotalPaiseBackend}`
    );

    const taxRate = 0.02;
    const taxPaiseBackend = Math.round(subtotalPaiseBackend * taxRate);
    console.log(`Backend Tax Rate: ${taxRate * 100}%`);
    console.log(`Backend Tax in Paise (rounded): ${taxPaiseBackend}`);

    const totalAmountInPaise = subtotalPaiseBackend + taxPaiseBackend;
    console.log(
      `Backend Calculated Total (in paise) for Razorpay order: ${totalAmountInPaise}`
    );

    if (paymentType === "COD") {
      try {
        const newOrder = await Order.create({
          user_id: userId,
          products: populatedItems.map((item) => ({
            product_id: item.product,
            quantity: item.quantity,
            seller_id: item.seller_id,
          })),
          shippingAddress: shippingAddress,
          paymentType: "COD",
          amount: totalAmountInPaise,
          status: "placed",
          isPaid: false,
        });
        console.log("COD Order Created:", newOrder._id);

        await Cart.deleteMany({ user_id: userId });
        console.log(`Cart cleared for user ${userId}`);

        return res.status(201).json({
          success: true,
          order: newOrder,
          message: "Order placed via COD.",
        });
      } catch (codOrderError) {
        console.error(
          "Error creating COD order or clearing cart:",
          codOrderError
        );
        return res
          .status(500)
          .json({ success: false, message: "Failed to place COD order." });
      }
    } else if (paymentType === "ONLINE") {
      try {
        const options = {
          amount: totalAmountInPaise,
          currency: "INR",
          // --- CHANGED: Shortened receipt to fit Razorpay's 40-character limit ---
          receipt: `order_${Date.now()}`, // Example: order_1719500000000 (19 characters)
          notes: {
            userId: userId.toString(),
          },
        };

        console.log(
          "Attempting to create Razorpay order with options:",
          options
        );
        const razorpayOrder = await razorpay.orders.create(options);
        console.log("Razorpay Order Created:", razorpayOrder);

        return res.status(200).json({
          success: true,
          requiresPayment: true,
          paymentData: razorpayOrder,
          message: "Razorpay order created successfully. Proceed with payment.",
        });
      } catch (razorpayOrderError) {
        console.error("Error creating Razorpay order:", razorpayOrderError);
        // Check if the error is due to an invalid API key or network issue
        if (
          razorpayOrderError.statusCode === 400 &&
          razorpayOrderError.error?.description
        ) {
          return res.status(400).json({
            success: false,
            message: `Razorpay Error: ${razorpayOrderError.error.description}`,
          });
        }
        return res.status(500).json({
          success: false,
          message:
            "Failed to initiate online payment. Please check Razorpay keys.",
        });
      }
    } else {
      console.error("Invalid Payment Type:", paymentType);
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment type provided." });
    }
  } catch (error) {
    // This is the outer catch block for unexpected errors
    console.error("Critical Cart Checkout Server Error:", error);
    // More specific error handling for common Mongoose/DB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: `Data validation error: ${error.message}`,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: ${error.message}`,
      });
    }
    res.status(500).json({
      success: false,
      message:
        "An unexpected server error occurred during checkout. Please try again.",
    });
  }
};

// POST /api/order/verifycart
export const verifyCartPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails, // Includes products, shippingAddress, amount (from frontend)
    } = req.body;
    const user_id = req.user._id; // Assuming user is authenticated and req.user is available

    // --- Debugging step: Log received Razorpay data ---
    console.log("Received Razorpay data for verification:");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Received Signature:", razorpay_signature);
    console.log("Order Details:", JSON.stringify(orderDetails, null, 2));

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is not set in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Razorpay secret key missing.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Generated Body for Hashing:", body);
    console.log(
      "Expected Signature (calculated on backend):",
      expectedSignature
    );

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch detected:");
      console.error("Expected:", expectedSignature);
      console.error("Received:", razorpay_signature);
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // --- Signature matched, proceed with payment and order processing ---

    // 2. Verify Razorpay payment status and amount (using Razorpay API)
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    console.log(
      "Fetched Payment Details from Razorpay:",
      JSON.stringify(paymentDetails, null, 2)
    );

    if (paymentDetails.status !== "captured") {
      console.error("Payment not captured. Status:", paymentDetails.status);
      return res
        .status(400)
        .json({ success: false, message: "Payment not captured" });
    }

    // Validate backend-calculated amount against Razorpay's amount
    const backendSubtotalPromises = orderDetails.products.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
        // If product is not found, this is a serious data integrity issue or attack attempt
        throw new Error(
          `Product with ID ${item.product_id} not found during amount verification.`
        );
      }
      const itemPrice = parseFloat(product.offerPrice || product.price || 0);
      return itemPrice * item.quantity;
    });

    const backendSubtotals = await Promise.all(backendSubtotalPromises);
    const subtotalAmountFromProducts = backendSubtotals.reduce(
      (sum, val) => sum + val,
      0
    ); // Still in "dollars" (decimal)

    // --- ALIGN CALCULATION WITH FRONTEND ---
    // 1. Convert subtotal amount to paise and round
    const subtotalPaiseBackend = Math.round(subtotalAmountFromProducts * 100);
    console.log(
      `Backend Subtotal Amount (from products): $${subtotalAmountFromProducts.toFixed(
        2
      )}`
    );
    console.log(`Backend Subtotal in Paise (rounded): ${subtotalPaiseBackend}`);

    const taxRate = 0.02; // Assuming 2% tax
    // 2. Calculate tax in paise directly from subtotalPaiseBackend and round
    const taxPaiseBackend = Math.round(subtotalPaiseBackend * taxRate);
    console.log(`Backend Tax Rate: ${taxRate * 100}%`);
    console.log(`Backend Tax in Paise (rounded): ${taxPaiseBackend}`);

    // 3. Sum subtotal and tax, both already in paise
    const totalInPaiseCalculated = subtotalPaiseBackend + taxPaiseBackend;
    console.log(
      `Backend Calculated Total (in paise): ${totalInPaiseCalculated}`
    );
    console.log(
      `Razorpay Captured Amount (in paise): ${paymentDetails.amount}`
    );

    if (paymentDetails.amount !== totalInPaiseCalculated) {
      console.error("Payment amount mismatch!");
      console.error(
        `Razorpay Amount: ${paymentDetails.amount}, Backend Calculated Amount: ${totalInPaiseCalculated}`
      );

      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch. Refund initiated.",
      });
    }

    // 3. Save payment record
    const paymentRecord = await Payment.create({
      user_id,
      razorpayOrderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      status: "Success",
      paymentMethod: paymentDetails.method.toUpperCase(),
    });
    console.log("Payment record created:", paymentRecord);

    // 4. Create Order
    const order = await Order.create({
      user_id,
      products: orderDetails.products,
      shippingAddress: orderDetails.shippingAddress,
      payment_id: paymentRecord._id,
      paymentType: "ONLINE",
      isPaid: true,
      amount: paymentDetails.amount,
      status: "Completed",
    });
    console.log("Order created:", order);

    // Update the payment record with the order ID
    paymentRecord.order_id = order._id;
    await paymentRecord.save();
    console.log("Payment record updated with order ID.");

    await Cart.deleteOne({ user_id });

    return res.status(201).json({
      success: true,
      message: "Cart order placed and payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error("Cart payment verification error:", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message:
        "Payment verification failed. Please try again or contact support.",
    });
  }
};
