const _ = require("lodash");
const bcrypt = require( "bcryptjs" );
const fs = require("fs");
//-------------------------------------------------
const UserModel = require("../models/User");
const {
	validateCreateUser,
	validateLoginUser,
	adduservalidator,
	passwdvalidator,
} = require("../validators/user");
//-------------------------------------------------

exports.register = async (req, res, next) => {
	try {
		const { error } = validateCreateUser(req.body);
		if (error) return res.status(422).json({ message: error.message });

		let user = await UserModel.findOne({ email: req.body.email });
		if (user)
			return res.status(400).json({ message: "کاربری با این ایمیل وجود دارد" });

		let checkUserName = await UserModel.findOne({ username: req.body.username });
		if (checkUserName)
			return res
				.status(400)
				.json({ message: "کاربری با این یوزرنیم وجود دارد" });

		user = new UserModel(_.pick(req.body, ["username", "email", "password"]));
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		user = await user.save();
		const token = user.generateAuthToken();
		res
			.header("Access-Control-Expose-headers", "x-auth-token")
			.header("x-auth-token", token)
			.status(201)
			.json(user);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}

};

exports.login = async (req, res, next) => {
	try {
		const { error } = validateLoginUser(req.body);
		if (error) return res.status(422).json({ message: error.message });
		// find user that user or email is equal to req.body.username
		const user = await UserModel.findOne( {
			$or: [
				{ email: req.body.username },
				{ username: req.body.username },
			],

		} );
		if (!user)
			return res
				.status(400)
				.json({ message: "کاربری با این ایمیل یا پسورد یافت نشد" });

		const result = await bcrypt.compare(req.body.password, user.password);
		if (!result)
			return res
				.status(400)
				.json({ message: "کاربری با این ایمیل یا پسورد یافت نشد" });

		const token = user.generateAuthToken();

		res
			.header("Access-Control-Expose-headers", "x-auth-token")
			.header("x-auth-token", token)
			.status(200)
			.json({ success: true });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

/////admin
exports.adduser = async (req, res, next) => {
	const { error } = adduservalidator(req.body);
	console.log(req.body);
	if (error) return res.status(422).json({ message: error.message });

	let user = await UserModel.findOne({ email: req.body.email });
	if (user)
		return res.status(400).send({ message: "کاربری با این ایمیل وجود دارد" });

	try {
		let checkuser = await UserModel.findOne({ username: req.body.username });
		if (checkuser)
			return res
				.status(400)
				.json({ message: "کاربری با این یوزرنیم وجود دارد" });

		user = new UserModel(
			_.pick(req.body, ["username", "email", "password", "role"])
		);

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		user = await user.save();

		const token = user.generateAuthToken();
		res
			.header("Access-Control-Expose-headers", "x-auth-token")
			.header("x-auth-token", token)
			.status(201)
			.json(user);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.deleteuser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const result = await UserModel.findByIdAndRemove(id);
		res.status(204).json({ res: true });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.changepassword = async (req, res, next) => {
	const { error } = passwdvalidator(req.body);
	if (error) return res.status(422).json({ message: error.message });
	const userid = req.user._id;
	const { old_pass, new_pass } = req.body;
	const user = await UserModel.findOne({ _id: userid });
	const user_pass = user.password;

	try {
		const is_same = await bcrypt.compare(old_pass, user_pass);

		if (!is_same) {
			res.status(400).json("old password wrong");
		} else {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(new_pass, salt);

			let user = await UserModel.findByIdAndUpdate(
				{ _id: userid },
				{ $set: { password: hash } },
				{ new: true }
			);

			res.status(200).json(_.pick(user, ["username", "_id"]));
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.list = async (req, res, next) => {
	try {
		let list = await UserModel.find().sort("-createdAt").select(["-password"]);
		res.json(list);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addphoto = async ( req, res, next ) =>
{

	
	try {
		const model = await UserModel.findById(req.user._id);
		model.photo = await "uploads/" + req.file.filename;
		
		res.status(200).json(model.photo);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.check = async (req, res, next) => {
	if (req.user) {
		res.status(200).json(req.user);
	} else {
		res.status(403).json({ massage: "user is not athenticated !" });
	}
};
