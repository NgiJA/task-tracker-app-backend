const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
const { User } = require("../models");

module.exports = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization || !authorization.startsWith("Bearer")) {
			throw new AppError("unauthenticated", 401);
		}

		const token = authorization.split(" ")[1];
		if (!token) {
			throw new AppError("unauthenticated", 401);
		}

		//check is token is googleId
		const userGoogleAccount = await User.findOne({
			where: { googleId: token }
		});
		if (userGoogleAccount) {
			req.user = userGoogleAccount; // เพิ่ม key ที่ชื่อ user ไว้ใน object req
			return next(); // ให้วิ่งไปทำงานที่ middlewares ตัวต่อไป
		}

		//check is token is paylod for userEmailAccount
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET_KEY || "private_key"
		);

		const userEmailAccount = await User.findOne({
			where: { id: payload.id },
			attributes: { exclude: "password" }
		});
		if (userEmailAccount) {
			req.user = userEmailAccount; // เพิ่ม key ที่ชื่อ user ไว้ใน object req
			return next(); // ให้วิ่งไปทำงานที่ middlewares ตัวต่อไป
		}

		if (!userGoogleAccount || !userEmailAccount) {
			throw new AppError("unauthenticated", 401);
		}
	} catch (err) {
		next(err);
	}
};
