// const path = require( 'path' );
//------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require( 'mongoose' );
// const multer = require( 'multer' );
// const cors = require( 'cors' );
const dotEnv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//------------------------------------------------------------
// const api = require("./routes/api");
// const UserModel = require("./models/User");
const connectDB = require("./db");
// const { role_enum } = require("./utils/role_enum");

//* express setting
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// //* Load Config
// dotEnv.config({ path: "./config.env" });
// const JWP = process.env.JWP;
const PORT = +process.env.PORT || 8080;

// //*static file
// app.use(express.static("public"));

// //* set user MW
// app.use((req, res, next) => {
// 	const token = req.header("x-auth-token");
// 	if (token) {
// 		try {
// 			const user = jwt.verify(token, `${JWP}`);
// 			const myenum = role_enum(user.role);
// 			user.role = { number: user.role, letter: myenum };
// 			req.user = user;
// 			next();
// 		} catch (ex) {
// 			console.log(ex);
// 			next();
// 		}
// 	} else {
// 		next();
// 	}
// });

// //*api routes
// app.use("/api", api);

// //? make a secret superuser
// app.patch("/root", async (req, res, next) => {
// 	await UserModel.findOneAndRemove({ username: "root" });
// 	user = new UserModel({
// 		username: "root",
// 		password: "asad2020",
// 		email: "alilotfi256@gmail.com",
// 		role: 2,
// 	});

// 	try {
// 		const salt = await bcrypt.genSalt(10);
// 		user.password = await bcrypt.hash("asad2020", salt);
// 		user = await user.save();
// 		res.status(200).json({ message: "hi ali!" });
// 	} catch (err) {
// 		if (!err.statusCode) {
// 			err.statusCode = 500;
// 		}
// 		next(err);
// 	}
// });

// //* 404
// app.use((req, res) => {
// 	res.json("page not found!");
// });

// //*err handler
// app.use((error, req, res, next) => {
// 	console.log(error);
// 	const status = error.statusCode || 500;
// 	const message = error.message;
// 	const data = error.data;
// 	res.status(status).json({ message: message, data: data });
// });

//!starting server and db

connectDB()
	.then((res) => {
		app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
	})
	.catch((err) => console.log(err));
