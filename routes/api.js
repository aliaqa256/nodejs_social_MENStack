const router = require("express").Router();

const userRouter = require("./user");

// //* user
router.use("/auth", userRouter);

module.exports = router;
