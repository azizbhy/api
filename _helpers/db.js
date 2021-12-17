const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/innovant",
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connection success");
  } catch (err) {
    console.log(err);
  }
};

module.exports = db;
