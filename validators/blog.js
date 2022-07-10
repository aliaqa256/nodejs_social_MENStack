const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const blogcreatevalidator = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		body: Joi.string().required(),
		tags: Joi.string(),
	});
	return schema.validate(data);
};

module.exports = { blogcreatevalidator };
