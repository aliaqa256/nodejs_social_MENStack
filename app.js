// const path = require( 'path' );
//------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require( 'mongoose' );
const multer = require( 'multer' );
const cors = require( 'cors' );
const dotEnv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//------------------------------------------------------------
const api = require("./routes/api");
const UserModel = require("./models/User");
const connectDB = require("./db");
const { role_enum } = require("./utils/role_enum");

//* express setting
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// //* Load Config
dotEnv.config({ path: "./config.env" });
const JWP = process.env.JWP;
const PORT = +process.env.PORT || 8080;

// //*static file
app.use(express.static("public"));

// //* set user MW
app.use((req, res, next) => {
	const token = req.header("x-auth-token");
	if (token) {
		try {
			const user = jwt.verify(token, `${JWP}`);
			const myenum = role_enum(user.role);
			user.role = { number: user.role, letter: myenum };
			req.user = user;
			next();
		} catch (ex) {
			console.log(ex);
			next();
		}
	} else {
		next();
	}
});

// //*api routes
app.use("/api", api);



// //* 404
app.use((req, res) => {
	res.status(404).send("page not found");
});

// //*err handler
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

//!starting server and db

connectDB()
	.then((res) => {
		app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
	})
	.catch((err) => console.log(err));
