module.exports = (err, req, res, next) => {
	console.log(err);

	// จับ error ที่เกิดจากเงื่อนไข model ที่สร้างไว้
	if (
		err.name === "SequelizeValidationError" ||
		err.name === "SequelizeUniqueConstraintError"
	) {
		// มาจาก console.log(err) --> ValidationError [SequelizeValidationError]: notNull Violation: User.firstName cannot be null
		err.statusCode = 400;
		err.message = err.errors[0].message;
	}
	// จับ error ที่เกิดจากเงื่อนไข model ที่สร้างไว้

	if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
		err.statusCode = 401;
	}

	res.status(err.statusCode || 500).json({ message: err.message });
};
