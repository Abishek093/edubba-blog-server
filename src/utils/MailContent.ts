export const generateOtpEmailContent = (name: string, otp: number) => {
    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .otp-code {
           
            color: #000000;
           
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
          .verify-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
          .verify-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Verify Your Email Address with EDUBBA</div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with EDUBBA. To complete your registration, please use the OTP below:</p>
           
            <h1 class="otp-code">${otp}</h1>

            
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};




export const generateResendOtpEmailContent = (name: string, otp: string) => {
    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Resend</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .otp-code {
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
          .verify-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
          .verify-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Resend OTP</div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>As requested, here is your OTP:</p>
            // <div class="otp-code">${otp}</div>
            <h1>${otp}</h1>

            <p>If you did not request this, please ignore this email.</p>
          </div>
          <a href="#" class="verify-button">Verify Email</a>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export const generatePasswordResetEmailContent = (name: string, resetToken: string) => {
    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}`;
    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
            margin: 0 auto; /* Center the container horizontally */
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
            .reset-link {
    color: #ffffff !important; /* Force white color */
  }
          .reset-link {
            display: inline-block; /* Adjust width based on text length */
            padding: 10px 20px; /* Padding around the text */
            font-size: 18px; /* Font size */
            font-weight: bold; /* Bold text */
            color: #ffffff; /* Text color set to white */
            background: linear-gradient(to right, #4f46e5, #7c3aed); /* Gradient background */
            border-radius: 1.5rem; /* Rounded corners */
            text-decoration: none; /* Remove underline */
            text-align: center; /* Center text */
            margin-top: 1rem; /* Margin on top */
            margin-bottom: 0.5rem; /* Margin on bottom */
            transition: background-color 0.3s ease; /* Smooth transition for background color */
            white-space: nowrap; /* Prevent text from wrapping */
          }
          .reset-link:hover {
            background: linear-gradient(to right, #4338ca, #6d28d9); /* Darker gradient on hover */
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Password Reset Request</div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to reset your password:</p>
            <a href="${resetLink}" class="reset-link">Reset Password</a>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p><a href="${resetLink}" style="color: #007bff;">${resetLink}</a></p>
            <p>If you did not request a password reset, please ignore this email. This link will expire in 1 hours.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

