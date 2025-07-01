import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"ShopEase" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "OTP for Email Verification",
    text: `Your OTP is ${otp}`,
    html: `
      <div style="font-family:Arial, sans-serif;">
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `,
  };

  try {
    console.log("📤 Sending OTP to:", email);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Email sending failed");
  }
};
