import express from "express";
import validateUser from "../middleware/validateUser.js";
import { userLoginSchema, userRegisterSchema } from "../schemas.js";
import * as users from "../controllers/user.js";
import { getCurrentUser } from "../controllers/user.js";

const router = express.Router();

router
  .route("/register")
  .get((req, res) => {
    res.send("sign up page");
  })
  .post(validateUser(userRegisterSchema), users.register);

router
  .route("/login")
  .get((req, res) => {
    res.send("login page");
  })
  .post(validateUser(userLoginSchema), users.login);

router.route("/logout").get((req, res) => {
  res.send("logout page");
});

router.get("/me", getCurrentUser);

export default router;
