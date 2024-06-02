module.exports = (sequelize, DataTypes) => {
	const Todo = sequelize.define("Todo", {
		date: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		task: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		status: {
			type: DataTypes.ENUM("To Do", "Done"),
			allowNull: false,
			defaultValue: "To Do"
		}
	});

	Todo.associate = (db) => {
		Todo.belongsTo(db.User, {
			foreignKey: {
				name: "userId",
				allowNull: false
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT"
		});
	};

	return Todo;
};
