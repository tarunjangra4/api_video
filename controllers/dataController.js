const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Introduction = require("../models/introduction.model");
const SEO = require("../models/seo.model");
const GoogleAds = require("../models/google_ads.model");
const FacebookAds = require("../models/facebook_ads.model");
const CRM = require("../models/crm.model");
const ChatBots = require("../models/chat_bots.model");
require("dotenv").config();

exports.uploadData = async (req, res) => {
  console.log("start 1 ", req.headers);
  const authHeader = req.body.headers.Authorization.split(" ")[1];
  console.log("authHeader ", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("start 2 ", token);
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }
  console.log("start 3");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    console.log("start 4");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found." });
    }
    console.log("start 5");
    if (user.userRole !== "admin") {
      return res.status(401).json({
        status: "error",
        error: "You are not allowed to do this operation.",
      });
    }
    console.log("start 6");
    const contentType = req.body.contentType;

    if (contentType === "Introduction") {
      console.log("if");
      await Introduction.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 7");
    } else if (contentType === "SEO") {
      console.log("start 8");
      await SEO.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 9");
    } else if (contentType === "GoogleAds") {
      console.log("start 10");
      await GoogleAds.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 11");
    } else if (contentType === "FacebookAds") {
      console.log("start 12");
      await FacebookAds.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 13");
    } else if (contentType === "CRM") {
      console.log("start 14");
      await CRM.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 15");
    } else if (contentType === "ChatBots") {
      console.log("start 16");
      await ChatBots.create({
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl,
        createdAt: Date.now(),
      });
      console.log("start 17");
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Video has been uloaded successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: "Token has expired.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        error: "Token is invalid or has been tampered with.",
      });
    }
  }
};

// update user profile api app.put("/api/user-profile",
exports.getData = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Profile updated successfully." });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      error: "Session expired, please log in again.",
    });
  }
};
