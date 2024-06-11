const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { User } = require("../models");

const genToken = (payload) =>
	jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", {
		expiresIn: process.env.JWT_EXPIRES || "1d"
	});

exports.signup = async (req, res, next) => {
	try {
		const { firstName, lastName, email, password, confirmPassword } = req.body;

		const isEmail = validator.isEmail(String(email));

		if (!email) {
			throw new AppError("email is required", 400);
		}
		if (!password) {
			throw new AppError("password is required", 400);
		}
		if (password !== confirmPassword) {
			throw new AppError("password and confirm password must be equal", 400);
		}
		if (!firstName) {
			throw new AppError("firstname is required", 400);
		}
		if (!lastName) {
			throw new AppError("lastname is required", 400);
		}

		if (!isEmail) {
			throw new AppError("email invalid format", 400);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
			registrationMethod: "email"
		});

		res.status(201).json({ message: "success signup" });
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email: email } });

		if (!user) {
			throw new AppError("username is invalid", 400);
		}

		const isCorrect = await bcrypt.compare(password, user.password); // ถ้า password ถูกจะเป็น true ถ้าไม่ถูกจะเป็น false
		if (!isCorrect) {
			throw new AppError("password is invalid", 400);
		}

		const token = genToken({ id: user.id });
		res.status(200).json({ token: token });
	} catch (err) {
		next(err);
	}
};

exports.googleLogin = async (req, res, next) => {
	try {
		const { email, family_name, given_name, sub } = req.body;
		const user = await User.findOne({ where: { googleId: sub } });
		if (user) {
			res.status(200).json({ token: sub });
		} else {
			await User.create({
				firstName: given_name,
				lastName: family_name,
				email: email,
				googleId: sub,
				registrationMethod: "google"
			});
			res.status(200).json({ token: sub });
		}
	} catch (err) {
		next(err);
	}
};
