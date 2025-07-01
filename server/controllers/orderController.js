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
      return res.status(400).json({ success: false, message: "Invalid data" });
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
          seller_id: product.seller_id,
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

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order_id: order._id,
      amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for the seller : /api/order/seller
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "products.seller_id": sellerId,
    })
      .populate("user_id", "name email")
      .populate("shippingAddress")
      .populate({
        path: "products.product_id",
        select: "name price offerPrice images",
      })
      .sort({ createdAt: -1 });

    const filteredOrders = orders.map((order) => {
      const filteredProducts = order.products.filter((p) =>
        p.seller_id.equals(sellerId)
      );
      return { ...order.toObject(), products: filteredProducts };
    });

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (err) {
    console.error("Error fetching seller orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for admin : /api/order/admin/all
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user_id",
        select: "name email",
      })
      .populate({
        path: "products.product_id",
        select: "name price offerPrice images",
      })
      .populate({
        path: "shippingAddress",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin Get All Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
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

    res.status(200).json({
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
    const role = req.user.role;

    const query =
      role === "admin" ? { _id: order_id } : { _id: order_id, user_id };

    const order = await Order.findOne(query);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled as it's already delivered or cancelled.",
      });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({
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
    const { items, address } = req.body;

    if (!address || !address._id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data: Missing address or items.",
      });
    }

    let totalAmount = 0;
    const productsForOrder = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.product}`);
      }

      if (!product.seller_id) {
        throw new Error(
          `Product (ID: ${item.product}) is missing a seller ID. Cannot place order.`
        );
      }

      const itemPrice = product.offerPrice || product.price || 0;
      totalAmount += itemPrice * item.quantity;

      productsForOrder.push({
        product_id: item.product,
        quantity: item.quantity,
        seller_id: product.seller_id,
      });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;
    totalAmount += Math.round(totalAmount * 0.02 * 100) / 100;

    await Order.create({
      user_id,
      products: productsForOrder,
      paymentType: "COD",
      amount: totalAmount,
      shippingAddress: address._id,
      status: "Pending",
    });

    return res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to place order: " + error.message,
    });
  }
};

// Checkout single product : /api/order/single-product-checkout
export const singleProductCheckout = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { productId, quantity, address, paymentType } = req.body;

    if (!productId || !quantity || !address || !paymentType) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID, quantity, address, and payment type are required.",
      });
    }

    let shippingAddressId;
    if (address._id) {
      shippingAddressId = address._id;
    } else {
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

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.seller_id) {
      throw new Error(
        `Product (ID: ${productId}) is missing a seller ID. Cannot proceed with order.`
      );
    }

    const basePrice = product.offerPrice || product.price || 0;
    const amountInCurrency =
      Math.round(basePrice * quantity * 1.02 * 100) / 100;

    if (paymentType === "ONLINE") {
      const shortUserId = user_id.toString().slice(-8);
      const shortTimestamp = Date.now().toString().slice(-8);
      const receiptId = `order_${shortUserId}_${shortTimestamp}`;

      const razorpayOptions = {
        amount: amountInCurrency * 100,
        currency: "INR",
        receipt: receiptId,
        notes: {
          userId: user_id.toString(),
          productId: productId.toString(),
          quantity: quantity.toString(),
          shippingAddressId: shippingAddressId.toString(),
        },
      };

      try {
        const razorpayOrder = await razorpay.orders.create(razorpayOptions);

        return res.status(200).json({
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

      return res.status(201).json({
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

// Checkout cart : /api/order/cart-checkout
export const cartCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products, shippingAddress, paymentType } = req.body;

    if (!shippingAddress || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing delivery address or items in cart.",
      });
    }

    let backendSubtotalDollars = 0;
    const populatedItems = [];

    for (const item of products) {
      try {
        const product = await Product.findById(item.product_id);
        if (!product) {
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
      } catch (productFetchError) {
        return res.status(500).json({
          success: false,
          message: `Error processing product ${item.product_id}.`,
        });
      }
    }

    const subtotalPaiseBackend = Math.round(backendSubtotalDollars * 100);
    const taxRate = 0.02;
    const taxPaiseBackend = Math.round(subtotalPaiseBackend * taxRate);
    const totalAmountInPaise = subtotalPaiseBackend + taxPaiseBackend;

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

        await Cart.deleteMany({ user_id: userId });

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
          receipt: `order_${Date.now()}`,
          notes: {
            userId: userId.toString(),
          },
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
          success: true,
          requiresPayment: true,
          paymentData: razorpayOrder,
          message: "Razorpay order created successfully. Proceed with payment.",
        });
      } catch (razorpayOrderError) {
        console.error("Error creating Razorpay order:", razorpayOrderError);
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment type provided." });
    }
  } catch (error) {
    console.error("Critical Cart Checkout Server Error:", error);
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
      orderDetails,
    } = req.body;
    const user_id = req.user._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Razorpay secret key missing.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    if (paymentDetails.status !== "captured") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not captured" });
    }

    const backendSubtotalPromises = orderDetails.products.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
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
    );

    const subtotalPaiseBackend = Math.round(subtotalAmountFromProducts * 100);
    const taxRate = 0.02;
    const taxPaiseBackend = Math.round(subtotalPaiseBackend * taxRate);
    const totalInPaiseCalculated = subtotalPaiseBackend + taxPaiseBackend;

    if (paymentDetails.amount !== totalInPaiseCalculated) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch. Refund initiated.",
      });
    }

    const paymentRecord = await Payment.create({
      user_id,
      razorpayOrderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      status: "Success",
      paymentMethod: paymentDetails.method.toUpperCase(),
    });

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

    paymentRecord.order_id = order._id;
    await paymentRecord.save();

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
