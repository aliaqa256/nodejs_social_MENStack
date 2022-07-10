const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateCreateUser = (data) => {
	const schema = Joi.object({
		username: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required(),
		confirmPassword: Joi.any()
			.valid(Joi.ref("password"))
			.required()
			.label("Confirm password")
			.messages({ "any.only": "password does not match" }),
	});
	return schema.validate(data);
};
const validateLoginUser = (data) => {
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	});
	return schema.validate(data);
};

const adduservalidator = (data) => {
	const schema = Joi.object({
		username: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required(),
		confirmPassword: Joi.any()
			.valid(Joi.ref("password"))
			.required()
			.label("Confirm password")
			.messages({ "any.only": "password does not match" }),
		role: Joi.number(),
	});
	return schema.validate(data);
};

const passwdvalidator = (data) => {
	const schema = Joi.object({
		old_pass: Joi.string().required(),
		new_pass: Joi.string().required(),
		confirmPassword: Joi.any()
			.valid(Joi.ref("new_pass"))
			.required()
			.label("Confirm password")
			.messages({ "any.only": "password does not match" }),
	});
	return schema.validate(data);
};

module.exports = {
	validateCreateUser,
	validateLoginUser,
	adduservalidator,
	passwdvalidator,
};
