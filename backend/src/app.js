import express from "express";

import ExpressError from "./utils/ExpressError.js";

import sparePartRoutes from "./routes/spare-part.js";
import userRoutes from "./routes/user.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitizeV5 from "./utils/mongoSanitizeV5.js";

const app = express();


//depends what type of body parsing I want, for regular form -->
app.use(express.urlencoded({ extended: true }));
//for json - raw data -->
app.use(express.json());

app.use(sanitizeV5({ replaceWith: "_" }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(limiter);


app.use("/", userRoutes);
app.use("/spare-part-list", sparePartRoutes);

//to catch all route, if there is no match
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//Error handler middleware
app.use((err, req, res, _next) => {
  const { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

export default app;
