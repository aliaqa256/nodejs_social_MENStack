const _ = require("lodash");
const BlogModel = require("../models/Blog");
const slugify = require("slugify");
const UserModel = require("../models/User");

const { blogcreatevalidator } = require("../validators/blog");

class BlogController {
	async like(req, res) {
		let blog = await BlogModel.findOne({ slug: req.params.slug });

		if (blog.likes == req.user._id) {
			blog.likes.pull(req.user._id);
			await blog.save();
			res.status(200).send("unliked");
		} else {
			blog.likes.push(req.user._id);
			await blog.save();
			res.status(200).send("liked");
		}
	}

	async posts_has_tag(req, res) {
		let blog = await BlogModel.find({ tags: req.params.tag });

		res.send(blog);
	}
	async posts_has_category(req, res) {
		let blog = await BlogModel.find({ categories: req.params.catid });
		// let blog = await BlogModel.find({$or: [{'categories': req.params.catid}]})

		res.send(blog);
	}

	async adminlistview(req, res) {
		if (req.user.role == 2) {
			let blog = await BlogModel.find().sort("-createdAt");
			res.send(blog);
		} else {
			let blog = await BlogModel.find({ user: req.user._id }).sort(
				"-createdAt"
			);
			res.send(blog);
		}
	}
	async listview(req, res) {
		let blog = await BlogModel.find().sort("-createdAt");
		res.send(blog);
	}
	async deleteblog(req, res) {
		var check_for_delete_blog = await BlogModel.find({
			_id: req.params.id,
		}).distinct("user");

		if (req.user.role == 2) {
			let blog = await BlogModel.findByIdAndRemove(req.params.id);
			res.status(204).send("deleted");
		} else {
			if (check_for_delete_blog[0] == req.user._id) {
				let blog = await BlogModel.findByIdAndRemove(req.params.id);
				res.status(204).send("deleted");
			} else {
				res.status(403).send("you cant delete someone`s post");
			}
		}
	}

	async updateblog(req, res) {
		const { error } = blogcreatevalidator(
			_.pick(req.body, ["title", "body", "tags"])
		);
		const checkblog = await BlogModel.findOne({
			slug: slugify(req.body.title),
		});
		if (checkblog)
			return res.status(400).send({ message: "عنوان پست مشکل دارد" });

		if (error) return res.status(400).send({ message: error.message });
		var check_for_update_blog = await BlogModel.find({
			_id: req.params.id,
		}).distinct("user");

		if (req.user.role == 2) {
			const result = await BlogModel.findByIdAndUpdate(
				req.params.id,
				{
					$set: _.pick(req.body, ["title", "body", "slug", "tags"]),
				},
				{ new: true }
			);
			res.status(200).send("updated");
		} else {
			if (check_for_update_blog[0] == req.user._id) {
				const result = await BlogModel.findByIdAndUpdate(
					req.params.id,
					{
						$set: _.pick(req.body, ["title", "body", "slug", "tags"]),
					},
					{ new: true }
				);
				res.status(200).send("updated");
			} else {
				res.status(403).send("you cant change someone`s post");
			}
		}
	}

	async addcomment(req, res) {
		const data = await BlogModel.findOne({ slug: req.params.slug });
		if (!data) return res.status(404).send("not found");

		const body = {
			user: req.user.username,
			text: req.body.text,
		};
		data.comment.push(body);
		await data.save();
		res.send(true);
	}

	async detailview(req, res) {
		let blog = await BlogModel.findOne({ slug: req.params.slug }).populate(
			"user",
			"username"
		);

		res.send(blog);
	}

	async create(req, res) {
		const { error } = blogcreatevalidator(
			_.pick(req.body, ["title", "body", "tags"])
		);
		if (error) return res.status(400).send({ message: error.message });
		const checkblog = await BlogModel.findOne({
			slug: slugify(req.body.title),
		});
		if (checkblog)
			return res.status(400).send({ message: "عنوان پست مشکل دارد" });


		let blog = new BlogModel(_.pick(req.body, ["title", "body"]));

		if (req.body.tags) {
			let tags = req.body.tags;
			tags = tags.split(",");
			for (let tag in tags) {
				blog.tags.push(tags[tag]);
			}
		}
		if (req.body.categories) {
			let categories = req.body.categories;
			categories = categories.split(",");
			console.log(categories);
			for (let cat in categories) {
				blog.categories.push(categories[cat]);
			}
		}

		blog.slug = await slugify(req.body.title);

		blog.user = await req.user;

		if (req.file) {
			blog.image = (await "uploads/") + req.file.filename;
		}
		blog = await blog.save();

		res.status(200).send(blog);
		console.log(process.domain);
	}
}

module.exports = new BlogController();
