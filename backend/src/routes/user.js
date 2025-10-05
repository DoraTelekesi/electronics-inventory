import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router
  .route("/register")
  .get((req, res) => {
    res.send("sign up page");
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });

router
  .route("/login")
  .get((req, res) => {
    res.send("login page");
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }

      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
  });

router.route("/logout").get((req, res) => {
  res.send("logout page");
});

export default router;
