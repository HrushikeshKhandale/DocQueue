const mongoose = require("mongoose");
const MONGO_URI = "mongodb://127.0.0.1:27017/DocQueue";

const connectToMongo = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to mongo successfully.");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });
};

module.exports = connectToMongo;
