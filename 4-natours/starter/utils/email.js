const nodemailer = require(`nodemailer`);

async function sendEmail(options) {
  // Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define Email Options
  const mailOptions = {
    from: `Mihalo Jesic <admin@admin.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send Email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
