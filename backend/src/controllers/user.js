import User from "../models/user.js";
import ExpressError from "../utils/ExpressError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User successfully created", user: newUser });
  } catch (error) {
    console.log(error);
    return next(new ExpressError("Error creating user", 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError("Invalid email or password!", 400));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(new ExpressError("Invalid email or password!", 400));
    }
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie("token", token, {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"Strict",
      maxAge:60*60*1000,
    })
    
    res.status(200).json({
      message: "Login successful!",
    
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token; // read JWT from cookie
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password"); // exclude password
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token", err });
  }
};