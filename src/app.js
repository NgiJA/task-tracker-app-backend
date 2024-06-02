const { sequelize } = require("./models");
//sequelize.sync({ alter: true });
// const { User } = require("./models");

require("dotenv").config(); // เรียกใช้ทุกอย่างใน .env
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const notFound = require("./middlewares/notFound");
const error = require("./middlewares/error");

const authRouteUser = require("./routes/authRoute");
const featureRoute = require("./routes/featureRoute");
const authenticate = require("./middlewares/authenticate");

const app = express();

app.use(cors()); // ให้ server สามารถรับ request ที่มาจากต่าง domain ได้
app.use(express.json()); //sets up middleware in Express application to parse incoming request bodies encoded in application/x-www-form-urlencoded format.
app.use(express.urlencoded({ extended: false })); // sets up middleware in Express application to parse incoming request bodies in JSON format.

let conn = null;

const initMySQL = async () => {
	conn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT
	});

	// Set the time zone for the connection
	await conn.query("SET time_zone = '+07:00'");
};

// app.get("/users", async (req, res) => {
// 	try {
// 		const results = await conn.query("SELECT * FROM users");
// 		res.json(results[0]);
// 	} catch (err) {
// 		console.log("Error fetching users: ", error.message);
// 		res.status(500).json({ error: "Error fetching users" });
// 	}
// });

// app.get("/users", async (req, res) => {
// 	try {
// 		const users = await User.findAll();
// 		res.status(200).json({ users: users });
// 	} catch (err) {
// 		console.log("Error fetching users: ", error.message);
// 		res.status(500).json({ error: "Error fetching users" });
// 	}
// });

app.use("/auth", authRouteUser);
app.use("/feature", authenticate, featureRoute);

app.use(notFound);
app.use(error);

const port = process.env.PORT || 8000;

//app.listen(port, () => console.log(`server running on port: ${port}`));
app.listen(port, async (req, res) => {
	await initMySQL();
	console.log(`server running on port: ${port}`);
});
