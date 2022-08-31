import express from "express";
import {
  protectorMiddleware,
  securityLogger,
  timeLogger,
  urlLogger,
} from "./middlewares/middlewares_challenge";

const heroku = process.env.NODE_ENV;
const $PORT = heroku ? process.env.PORT : 3000;
const app = express();

app.get("/", urlLogger, timeLogger, securityLogger, (req, res) => {
  return res.send("hi");
});

app.get("/protected", protectorMiddleware, () => {
  return res.send("hey get the fuck out");
});

app.listen($PORT, () => {
  console.log(`the app is listening to the port ${$PORT}`);
});
