require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/User");
const upload = require("./upload");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/hello", (req, res) => {
  res.status(200).json({
    message: "Hello world",
  });
});

const secretKey = "secret1234";

const generateAccessToken = (_id) => {
  return jwt.sign({ _id }, secretKey);
};

const SERVER_URL = "http://localhost:4000";

function formatUser(user) {
  return {
    name: user.name,
    email: user.email,
    speciality: user.speciality,
    description: user.description,
    profilePicture: user.profilePicture
      ? `${SERVER_URL}/${user.profilePicture}`
      : "",
  };
}

function checkAuth(req, res, next) {
  let token = req.headers?.authorization?.split?.(" ")?.[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token is missing" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded payload to the request for use in subsequent routes
    req.userID = decoded._id;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Token is invalid" });
  }
}

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const doesExists = await UserModel.findOne({ email });
    if (doesExists) {
      return res.status(400).json({
        success: false,
        errors: {
          email: "Email already exists",
        },
      });
    }
    const user = await UserModel.create({
      name,
      email,
      password,
    });
    const accessToken = generateAccessToken(user._id);
    res.status(201).json({
      success: true,
      data: {
        token: accessToken,
        user: formatUser(user),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }
    const accessToken = generateAccessToken(user._id);
    res.status(201).json({
      success: true,
      data: {
        token: accessToken,
        user: formatUser(user),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.get("/auth", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userID).orFail();
    res.status(200).json({
      success: true,
      data: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.post(
  "/update",
  checkAuth,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { userID, body, file } = req;
      const { name, speciality, description, profilePicture } = body;
      let data = {
        name,
        speciality,
        description,
      };
      if (!profilePicture) {
        data.profilePicture = "";
      }
      if (file) {
        data.profilePicture = file.path;
      }

      const user = await UserModel.findByIdAndUpdate(userID, data, {
        new: true,
      }).orFail();
      res.status(200).json({
        success: true,
        data: formatUser(user),
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

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
