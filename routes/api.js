const router = require("express").Router();

const userRouter = require( "./user" );
const BlogRouter = require("./blog");

// //* user
router.use( "/auth", userRouter );
// blog 
router.use("/blog", BlogRouter);

module.exports = router;
