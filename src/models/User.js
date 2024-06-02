module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	User.associate = (db) => {
		User.hasMany(db.Todo, {
			foreignKey: {
				name: "userId",
				allowNull: false
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT"
		});
	};

	return User;
};
