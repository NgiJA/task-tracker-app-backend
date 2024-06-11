module.exports = (sequelize, DataTypes) => {
	const OTP = sequelize.define("OTP", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		otp: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	});

	return OTP;
};
