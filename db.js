const mongoose = require("mongoose");
const dotEnv = require("dotenv");
//* Load Config
dotEnv.config({ path: "./config.env" });
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGPPASS, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

module.exports = connectDB;
