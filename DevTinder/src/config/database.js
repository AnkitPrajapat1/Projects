const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ankitprajapat403:GFi6gr7BiRwaVzWL@devtinder.lkkitxt.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
// connectDB()
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.log("Database not connected", err));
