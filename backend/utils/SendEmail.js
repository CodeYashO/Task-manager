const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.email",
      port: 587,
      auth: {
        user: "dubeyyash2422@gmail.com",
        pass: "kjgu befr kplm keuu",
      },
    }); 

    const info = await transporter.sendMail({   
      from: "dubeyyash2422@gmail.com",
      to: email,  
      subject: subject,
      text: message, 
    }); 
 
    console.log("email sent successfully")
  } catch (err) {
    console.error("error sending email:", err) 
  }  
}

module.exports = sendEmail;