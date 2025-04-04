import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email provider
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(emailOptions: nodemailer.SendMailOptions) {
  try {
    await transporter.sendMail(emailOptions);
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: error || "Error sending email" };
  }
}
