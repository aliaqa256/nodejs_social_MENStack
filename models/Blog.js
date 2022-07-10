const mongoose = require("mongoose");

//////comment
const schemeComment = new mongoose.Schema(
	{
		user: { type: String, required: true },
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "title is required"],
		},
		slug: {
			type: String,
			required: [true, "slug is required"],
			unique: true,
		},
		body: {
			type: String,
			required: [true, "body is required"],
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		comment: [schemeComment],
		tags: [String],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
		image: String,
	},
	{ timestamps: true }
);
// schema.index({ title: 'text', body: 'text', tags: 'text' })
const model = mongoose.model("blog", schema);

module.exports = model;
