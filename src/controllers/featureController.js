const AppError = require("../utils/appError");
const { User, Todo } = require("../models");

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.user.id }
		});
		res.status(200).json({ user: user });
	} catch (err) {
		next(err);
	}
};

exports.createTask = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const taskList = req.body;

		if (!taskList || !Array.isArray(taskList)) {
			throw new AppError("taskList is required and must be an array", 400);
		}

		for (let item of taskList) {
			const { task, date } = item;

			if (!task) {
				throw new AppError("task is required", 400);
			}
			if (!date) {
				throw new AppError("date is required", 400);
			}

			await Todo.create({
				task: task,
				date: date,
				userId: userId
			});
		}

		res.status(201).json({ message: "success create task" });
	} catch (err) {
		next(err);
	}
};

exports.getTask = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const task = await Todo.findAll({ where: { userId: userId } });
		res.status(200).json({ task: task });
	} catch (err) {
		next(err);
	}
};

exports.deleteTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const userId = req.user.id;
		const task = await Todo.findOne({
			where: { id: taskId, userId: userId }
		});

		if (task != null) {
			await Todo.destroy({ where: { id: taskId, userId: userId } });
			res.status(200).json({ message: "success delete task" });
		} else {
			throw new AppError("not found task to delete", 400);
		}
	} catch (err) {
		next(err);
	}
};

exports.editTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const userId = req.user.id;
		const { task, date } = req.body;

		if (!task) {
			throw new AppError("task is required", 400);
		}
		if (!date) {
			throw new AppError("date is required", 400);
		}

		const oldTask = await Todo.findOne({
			where: { id: taskId, userId: userId }
		});

		if (oldTask != null) {
			await Todo.update(
				{
					date: date,
					task: task
				},
				{ where: { id: taskId, userId: userId } }
			);
			res.status(200).json({ message: "success edit task" });
		} else {
			throw new AppError("not found task to edit", 400);
		}
	} catch (err) {
		next(err);
	}
};

exports.toggleTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const userId = req.user.id;

		const oldTask = await Todo.findOne({
			where: { id: taskId, userId: userId }
		});

		if (oldTask != null) {
			await Todo.update(
				{
					status: oldTask.status == "To Do" ? "Done" : "To Do"
				},
				{ where: { id: taskId, userId: userId } }
			);
			res.status(200).json({ message: "success toggle task" });
		} else {
			throw new AppError("not found task to toggle", 400);
		}
	} catch (err) {
		next(err);
	}
};
