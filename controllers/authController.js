// const express = require("express");
// const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
require("dotenv").config();

// sign up api app.post("/api/register",
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ status: "ok", message: "User has been created." });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(400).json({
        status: "error",
        error: "Email already exists. Please use a different email.",
      });
    } else {
      // Other errors
      return res.status(500).json({
        status: "error",
        error: "Registration failed due to an internal server error.",
      });
    }
  }
};

// login api app.post("/api/login",
exports.login = async (req, res) => {
  if (!req.body.email) {
    return res.status(401).json({
      status: "error",
      error: "Please Provide a valid email.",
    });
  }
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json({
        status: "error",
        error:
          "User not found. Please check your email or register a new account.",
      });
    } else {
      console.log(user);

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(isPasswordValid);
      console.log(process.env.ACCESS_TOKEN_SECRET);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            email: user.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { algorithm: "RS256" },
          { expiresIn: 604800 }
        );
        console.log("token", token);
        return res.status(200).json({ status: "ok", token });
      } else {
        return res
          .status(401)
          .json({ status: "error", error: "Password is invalid." });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal server error. Please try again later.",
    });
  }
};
