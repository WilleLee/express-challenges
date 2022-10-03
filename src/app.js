import * as dotenv from "dotenv";
dotenv.config();
import "./db";
import express from "express";
import MongoStore from "connect-mongo";
//middlewares
import session from "express-session";
import morgan from "morgan";
import {
  localsMiddleware,
  protectorMiddleware,
} from "./middlewares/middlewares_challenge";
//routers
import globalRouter from "./routers/globalRouter";
import movieRouter from "./routers/movieRouter";
import storiesRouter from "./routers/storiesRouter";
import usersRouter from "./routers/usersRouter";
import filesRouter from "./routers/filesRouter";

const heroku = process.env.NODE_ENV;
const $PORT = heroku ? process.env.PORT : 3000;
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan("dev"));
// Predefined Formats of morgan
// "dev" -> :method :url :status :response-time ms - :res[content-length]
//app.use(morgan(":status :method :url :http-version :response-time ms"));
// or can customize the set of the morgan notification (https://www.npmjs.com/package/morgan)

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); // expose specific folders
app.use("/static", express.static("assets"));
app.use("/public", express.static("public"));

app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/stories", storiesRouter);
app.use("/movies", movieRouter);
app.use("/files", filesRouter);

app.listen($PORT, () => {
  console.log(`the app is listening to the port ${$PORT}`);
});
