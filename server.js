const path = require('path');

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

//routes
const PostRoute = require("./routes/PostRoute");
const CommentRoute = require("./routes/CommentRoute");
const ReactionRoute = require("./routes/ReactionRoute");
const FollowRoute = require("./routes/FollowRoute");
const ChildRoute = require("./routes/ChildRoute");
const UserRoute = require("./routes/UserRoute");
const authRoute = require('./routes/authRoute')
// connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'upload')))



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// mount Routes
app.use("/api/v1/posts", PostRoute);
app.use("/api/v1/Comments", CommentRoute);
app.use("/api/v1/Reactions", ReactionRoute);
app.use("/api/v1/Follow", FollowRoute);
app.use("/api/v1/Children", ChildRoute);
app.use("/api/v1/users",UserRoute);
app.use("/api/v1/auth",authRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global  error Handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running ON PORT ${PORT}`);
});

// Events => list => callback(err) خارج ال express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
