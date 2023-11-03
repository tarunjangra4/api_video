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

// update qoute in the user object
// app.put("/api/quote", async (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res
//       .status(401)
//       .json({ status: "error", error: "Token is missing." });
//   }

//   try {
//     const decoded = jwt.verify(token, "secret1234567");
//     const email = decoded.email;
//     await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });

//     return res.json({ status: "ok" });
//   } catch (error) {
//     return res.json({ status: "error", error: "Invalid token" });
//   }
// });

// app.get("/api/quote", async (req, res) => {
// const authHeader = req.headers["authorization"];
// const token = authHeader && authHeader.split(" ")[1];
// if (!token) {
//   return res
//     .status(401)
//     .json({ status: "error", error: "Token is missing." });
// }
//   try {
//     const decoded = jwt.verify(token, "secret1234567");
//     const email = decoded.email;
//     const user = await User.findOne({ email: email });

//     return { status: "ok", quote: user.quote };
//   } catch (error) {
//     res.json({ status: "error", error: "Invalid token" });
//   }
// });

const PORT = process.env.PORT || 3005;
app.listen(PORT);
