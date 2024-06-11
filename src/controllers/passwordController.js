const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const AppError = require("../utils/appError");

exports.resetPassword = async (req, res, next) => {
	try {
		const { token, newPassword, confirmNewPassword } = req.body;

		if (!token) {
			throw new AppError("Token is required", 400);
		}
		if (!newPassword) {
			throw new AppError("New password is required", 400);
		}
		if (newPassword !== confirmNewPassword) {
			throw new AppError(
				"New password and confirm new password must be equal",
				400
			);
		}

		//ตอนที่ทำ jwt.verify ถ้า token expired จะเข้า catch และได้ err.name = "TokenExpiredError"
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET_KEY || "private_key"
		);
		const user = await User.findOne({ where: { email: decoded.email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await user.update({ password: hashedPassword });

		res.status(200).json({ message: "Password has been reset" });
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(400).json({ message: "Token has expired" });
		}
		next(err);
	}
};
