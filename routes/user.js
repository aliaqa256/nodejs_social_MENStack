const path = require("path");
const router = require("express").Router();
const multer = require("multer");
const usercontroler = require("../controlers/usercontroler");

const Auth = require("../middlewares/auth");
const vip = require("../middlewares/vip");
const superuser = require("../middlewares/super");

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

//*checktoken
router.get("/check", usercontroler.check);

router.post("/register", usercontroler.register);
router.post("/login", usercontroler.login);
//* auth
router.post("/passwd", Auth, usercontroler.changepassword);
router.put("/photo", Auth, upload.single("userphoto"), usercontroler.addphoto);

//*superuser
router.post("/add", Auth, superuser, usercontroler.adduser);
router.delete("/delete/:id", Auth, superuser, usercontroler.deleteuser);
router.get("/list", Auth, superuser, usercontroler.list);

module.exports = router;
