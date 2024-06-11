const { OTP } = require("../models");
const jwt = require("jsonwebtoken");

exports.verifyOTP = async (req, res, next) => {
	try {
		const { email, otp } = req.body;

		// Find the latest OTP entry for the given email
		const record = await OTP.findOne({
			where: { email, otp },
			order: [["createdAt", "DESC"]]
		});

		if (!record || record.expiresAt < new Date()) {
			return res.status(400).json({ message: "Invalid or expired OTP" });
		}

		const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
			expiresIn: "5m"
		}); // Token valid for 5 minutes

		res.status(200).json({ message: "OTP verified", token });
	} catch (err) {
		next(err);
	}
};
