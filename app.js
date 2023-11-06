require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authController = require("./controllers/authController");
const userProfileController = require("./controllers/userProfileController");
const awsController = require("./controllers/awsController");

// app.use(cors("http://localhost:3000"));
app.use(cors());
app.use(express.json()); // it is just a middleware will parse the body into json

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL);
// mongoose.connect(
//   "mongodb+srv://tarunjangra4:" +
//     encodeURIComponent("Tarun@123") + // URL-encode the password
//     "@cluster0.euqnn.mongodb.net/video-app?retryWrites=true&w=majority"
// );

// Register and login routes from authController
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

// User profile and quote routes from respective controllers
app.get(
  "/api/user-profile",
  authenticateTokenMiddleware,
  userProfileController.getUserProfile
);
app.put(
  "/api/user-profile",
  // authenticateTokenMiddleware,
  userProfileController.updateUserProfile
);

function authenticateTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: "error", error: "You are not authorized." });
    }

    req.user = user;
    next();
  });
}

const PORT = process.env.PORT || 3005;
app.listen(PORT);
