import express from "express";
import User from "../models/user.js";

const router = express.Router();

router
  .route("/register")
  .get((req, res) => {
    res.send("sign up page");
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });

router.route("/login").get((req, res) => {
  res.send("login page");
});

router.route("/logout").get((req, res) => {
  res.send("logout page");
});

export default router;
