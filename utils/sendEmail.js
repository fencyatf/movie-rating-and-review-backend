import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com", // 🔹 Replace with your email
                pass: "your-email-password", // 🔹 Replace with your email password or app password
            },
        });

        const mailOptions = {
            from: "your-email@gmail.com",
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export default sendEmail;