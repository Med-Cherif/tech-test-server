require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/hello", (req, res) => {
  res.status(200).json({
    message: "Hello world",
  });
});

const PORT = process.env.PORT || 4000;

const runApp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log("Server is listening on PORT", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

runApp();
