const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config({ path: "../config.env" });
const JWP = process.env.JWP;

module.exports = function (req, res, next) {
	try {
		const role = req.user.role.number;
		if (role >= 2) return next();
		else return res.status(401).json("شما اجازه دسترسی به این دیتا را ندارید");
	} catch (err) {
		console.log(err);
		return res.status(401).json("شما اجازه دسترسی به این دیتا را ندارید");
	}
};
