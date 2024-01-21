import { NextFunction, Response } from 'express';
import nodemailer from 'nodemailer';
import otpVerification from '../model/otpVerification';
import logger from '../utils/logger';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: config.SMTP_SRC === 'flase',
  auth: {
    user: config.SMTP_MAIL,
    pass: config.SMTP_PASSWORD,
  },
});

const otpService = async (
  { id, email }: { id: any; email: string },
  res: Response,
  next: NextFunction,
) => {
  try {
    // generate otp
    const OTP = Math.floor(100000 + Math.random() * 900000);

    // sent mail
    let sentEmail = {
      from: '"RecruitX" info.sumit2001@gmail.com',
      to: email,
      subject: 'Verify OTP - RecruitX',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Verify your login</title>
              </head>
            
              <body
                style="
                  font-family: Helvetica, Arial, sans-serif;
                  margin: 0px;
                  padding: 0px;
                  background-color: #ffffff;
                "
              >
                <table
                  role="presentation"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 0px;
                    border-spacing: 0px;
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: rgb(239, 239, 239);
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        align="center"
                        style="padding: 1rem 2rem; vertical-align: top; width: 100%"
                      >
                        <table
                          role="presentation"
                          style="
                            max-width: 600px;
                            border-collapse: collapse;
                            border: 0px;
                            border-spacing: 0px;
                            text-align: left;
                          "
                        >
                          <tbody>
                            <tr>
                              <td style="padding: 40px 0px 0px">
                              <div style="text-align: center">
                              <div style="padding-bottom: 20px">
                                <img
                                  src="https://i.ibb.co/Y3MpngC/logo.png"
                                  alt="Company"
                                  style="width: 120px"
                                />
                              </div>
                            </div>
                                <div
                                  style="
                                    padding: 20px;
                                    background-color: rgb(255, 255, 255);
                                  "
                                >
                                  <div style="color: rgb(0, 0, 0); text-align: left">
                                    <h1 style="margin: 1rem 0">Verification code</h1>
                                    <p style="padding-bottom: 16px">
                                      Please use the verification code below to sign in.
                                    </p>
                                    <p style="padding-bottom: 16px">
                                      <strong style="font-size: 130%">${OTP}</strong>
                                    </p>
                                    <p style="padding-bottom: 16px">
                                       <b>NOTE:</b> This code is expires in 1 hour.
                                    </p>
                                    <p style="padding-bottom: 16px">
                                      If you didn’t request this, you can ignore this email.
                                    </p>
                                    <p style="padding-bottom: 16px">
                                      Thanks,<br />The RecruitX team
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style="
                                    padding-top: 20px;
                                    color: rgb(153, 153, 153);
                                    text-align: center;
                                  "
                                >
                                  <p style="padding-bottom: 16px">Made with ♥ by Sumit</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            </html>
            `,
    };

    await transporter.sendMail(sentEmail, (err, info) => {
      if (err) {
        return res.status(404).json({
          msg: 'Server is busy right now please try after some time.',
        });
      }
    });

    // save to the database
    const newOTP = await new otpVerification({
      userId: id,
      otp: OTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTP.save();
  } catch (err) {
    return logger.error(err);
  }
};

export default otpService;
