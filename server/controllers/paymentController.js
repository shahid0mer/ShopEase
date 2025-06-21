import razorpay from "../configs/razorpay";

//TO BE COMPLETED AFTER FRONTEND INTEGRATION

export const createPayment = async (req, res) => {
  try {
    const { amount, currency = "INR", order_id } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      reciept: `reciept_order_${order_id}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const payment = new Payment({
      user_id: req.userId,
      paymentMethod: "Online",
      order_id: req.body.order_id,
      transactionId: razorpay_payment_id,
      status: "Success",
    });

    await payment.save();

    res.json({ success: true, message: "Payment verified", payment });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  res.send({ message: "Payment status" });
};
export const getPaymentHistory = async (req, res) => {
  res.send({ message: "Payment history" });
};
