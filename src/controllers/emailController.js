const nodemailer = require("nodemailer");
const { User, OTP } = require("../models");

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

exports.sendEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		// Validate email format
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		// Check if the email exists in the database
		const user = await User.findOne({
			where: { email, registrationMethod: "email" }
		});

		if (!user) {
			// Send a generic response
			return res.status(200).json({
				message: "If this email is registered, you will receive an OTP."
			});
		}

		// Create OTP
		let digit = "0123456789";
		let otp = "";
		for (let i = 0; i < 6; i++) {
			otp += digit[Math.floor(Math.random() * 10)];
		}

		// Store the OTP in the database
		await OTP.create({
			email,
			otp,
			expiresAt: new Date(Date.now() + 5 * 60000)
		}); // OTP valid for 5 minutes

		// Create a transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER, // Your email address
				pass: process.env.EMAIL_PASS // Your email password or app-specific password
			}
		});

		// Set up email data with unicode symbols
		let mailOptions = {
			from: process.env.EMAIL_USER, // Sender address
			to: email, // List of receivers
			subject: "Please Verify Your Account", // Subject line
			text: "Hello From Todolist App", // Plain text body
			html: `<!DOCTYPE html>
			<html lang="en" >
			<head>
				<meta charset="UTF-8">
				<title>Todolist App - OTP Email Template</title>
				
			
			</head>
			<body>
			<!-- partial:index.partial.html -->
			<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
				<div style="margin:50px auto;width:70%;padding:20px 0">
					<div style="border-bottom:1px solid #eee">
						<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Password Recovery</a>
					</div>
					<p style="font-size:1.1em">Hi,</p>
					<p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
					<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
					<p style="font-size:0.9em;">Regards,<br />NgiJA</p>
				</div>
			</div>
			<!-- partial -->
				
			</body>
			</html>`
		};

		// Send mail with defined transport object
		await transporter.sendMail(mailOptions);

		return res.status(200).json({
			message: "If this email is registered, you will receive an OTP."
		});
	} catch (err) {
		next(err);
	}
};
