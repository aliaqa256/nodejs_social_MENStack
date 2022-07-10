const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config({ path: "../config.env" });
const JWP = process.env.JWP;
const { role_enum } = require("../utils/role_enum");

module.exports = function (req, res, next) {
	dotEnv.config({ path: "../config.env" });
	const JWP = process.env.JWP;
	const token = req.header("x-auth-token");
	if (!token)
		return res.status(401).json("شما اجازه دسترسی به این دیتا را ندارید");

	try {
		const user = jwt.verify(token, `${JWP}`);

		const myenum = role_enum(user.role);
		user.role = { number: user.role, letter: myenum };
		req.user = user;
		next();
	} catch (ex) {
		return res.status(401).json("شما اجازه دسترسی به این دیتا را ندارید");
	}
};
