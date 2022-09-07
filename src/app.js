import express from "express";
import morgan from "morgan";
import {
  protectorMiddleware,
  securityLogger,
  timeLogger,
  urlLogger,
} from "./middlewares/middlewares_challenge";
import globalRouter from "./routers/globalRouter";
import movieRouter from "./routers/movieRouter";
import storiesRouter from "./routers/storiesRouter";
import usersRouter from "./routers/usersRouter";

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

app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/stories", storiesRouter);
app.use("/movies", movieRouter);

app.get("/protected", protectorMiddleware, () => {
  return res.send("hey get the fuck out");
});

app.listen($PORT, () => {
  console.log(`the app is listening to the port ${$PORT}`);
});
