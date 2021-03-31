const mongoose = require("mongoose");
const Users = require("../models/userModel");
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  },
  async (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
    try {
      await Users.deleteMany({});

      console.log("db reset");
      await mongoose.connection.close();
      console.log("MongoDB disconnected");
      process.exit(0);
    } catch (err) {
      console.log(err);
    }
  }
);
