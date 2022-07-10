const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const jwt = require("jsonwebtoken");

//* Load Config
dotEnv.config({ path: "../config.env" });
const JWP = process.env.JWP;

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "username is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "email is required"],
		},
		password: {
			type: String,
			required: [true, "password is required"],
		},
		photo: String,

		role: { type: Number, enum: [0, 1, 2], required: true, default: 0 },
	},
	{ timestamps: true }
);

schema.methods.generateAuthToken = function () {
	//* Load Config
	dotEnv.config({ path: "../config.env" });
	const JWP = process.env.JWP;
	const data = {
		_id: this._id,
		username: this.username,
		role: this.role,
		photo: this.photo,
	};
	return jwt.sign(data, `${JWP}`, { expiresIn: "1h" });
};

const model = mongoose.model("User", schema);

module.exports = model;
