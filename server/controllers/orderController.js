import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

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

    const products = items.map((item) => ({
      product_id: item.product,
      quantity: item.quantity,
    }));

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
      $or: [{ paymentType: "COD" }, { ispaid: true }],
    })
      .populate("products.product_id shippingAddress")
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

    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      return res.json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.status = "CANCELLED";
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
    const { items, address } = req.body;

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

    amount += Math.floor(amount * 0.02); // Add tax

    const addressDoc = await Address.create({
      user_id,
      ...address,
    });

    const products = items.map((item) => ({
      product_id: item.product,
      quantity: item.quantity,
    }));

    await Order.create({
      user_id,
      products,
      paymentType: "COD",
      amount,
      shippingAddress: addressDoc._id,
    });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
