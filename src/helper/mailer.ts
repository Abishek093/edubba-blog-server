import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();


const sendMail = async ( email: string , htmlContent:string) => {
  try {
    

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.NODEMAILER_USER}`,
        pass: `${process.env.NODEMAILER_PASSWORD}`
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.NODEMAILER_USER}`,
      to: `${email}`,
      subject: "Email Verification Required",
      html: htmlContent
    };
    

    transporter.sendMail(mailOptions, (error:any, info:any) => {
      if (error) {
        console.log("Send mail")
        console.log(error);
      } else {
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;