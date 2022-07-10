const path = require("path");
const router = require("express").Router();
const multer = require("multer");
const blogController = require("../controlers/blogcontroller");

const Auth = require("../middlewares/auth");
const vip = require("../middlewares/vip");
const superuser = require("../middlewares/super");

/////multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images Only!");
	}
}

var upload = multer({
	storage: storage,
	limits: {
		fileSize: 5000000,
	},
	fileFilter: function (_req, file, cb) {
		checkFileType(file, cb);
	},
});

/////level -1
router.get("/tag/:tag", blogController.posts_has_tag);
router.get("/cat/:catid", blogController.posts_has_category);
router.get("/", blogController.listview);
router.get("/:slug", blogController.detailview);

/////level 0
router.post("/addcomment/:slug", Auth, blogController.addcomment);
router.post("/like/:slug", Auth, blogController.like);

////level 1&2
router.post(
	"/create",
	Auth,
	upload.single("blogimage"),
	blogController.create
);

router.get("/admin/listview", Auth, superuser, blogController.adminlistview);

router.delete("/admin/delete/:id", Auth, superuser, blogController.deleteblog);
router.put("/admin/update/:id", Auth, superuser, blogController.updateblog);

module.exports = router;
