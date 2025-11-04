import nodemailer from "nodemailer";


export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: false, // Brevo uses STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("sendOTPEmail function me agya");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");

  try {
    console.log("transporter ko verify karne gyaa");
    await transporter.verify();
    console.log("✅ SMTP connection successful");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
    throw err;
  }

  const mailOptions = {
    from: `"SkinEdu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for SkinEdu",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendOTPEmail error:", err);
    throw err;
  }
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to PROJECT-HD!",
    text: `Hi ${name},\n\nWelcome to our family! We're thrilled to have you onboard. Enjoy your journey with us.\n\n- PROJECT-HD Team`,
  };

  await transporter.sendMail(mailOptions);
};
