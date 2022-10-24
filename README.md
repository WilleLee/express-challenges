# express-challenges

## Deployment

<a href="https://expresstube.herokuapp.com"><img src="https://github.com/WilleLee/files/blob/main/expresstube_thumbnail.png" width="320" alt="expresstube link" /></a>

👆🏻 Click and browse the application

### Heroku

The app is deployed on heroku using Heroku CLI.

```
git heroku login
heroku git:clone -a applicationName
git add .
git commit -a "hello world to heroku"
git push heroku main
```

Before the deployment, both codes for the front-end and the back-end must be interpreted and compressed by "build" script command, and such process can be done by babel and webpack so that the "start" script command like below would be able to run the code inside the build directory to render the website.

```javascript
// ./package.json
{
  "scripts": {
    "start": "node build/app.js",
    "build": "npm run build:server && npm run build:assets",
    "build:server": "babel src -d build",
    "build:assets": "webpack --mode=production",
    "dev:server": "nodemon",
    "dev:assets": "webpack --mode=development -w"
  },
}
```

Unlike the port number for the application in development mode can be fixed since this is run on my own memory, Heroku gives a random port number for the application everytime it refreshes, thus the varible of the port number must be changable regarding the environment. Fortunately, heroku throws an environment varible for the production mode callded _NODE_ENV_ so that whether the application gets the value of the varibale or not can be used for the application to decide which value to hand over to the _PORT_ variable like below.

```javascript
// ./src/app.js

/*
...
*/

const heroku = process.env.NODE_ENV || null;
const $PORT = heroku ? process.env.PORT : 3000;
const app = express();

/*
...
*/

app.listen($PORT, () => {
  console.log(`the app is listening to the port ${$PORT}`);
});
```

This trick is quite useful for specific situations, i.e. if the application offers an OAuth for Naver or GitHub accounts our users have, two separate callback links might be requried, one for the production like _https://applicationName.herokuapp.com/naver/callback_ and another for the development like _http://localhost:3000/naver/callback_. The application now can send users to the appropriate link among two of those since the mode of the application can be defined with _heroku_ variable above.

## Development

### Environment

#### Webpack Configuration

Since it is quite usual to use the newest grammar of JavaScript, the written code needs to be interpreted to the old version of JavaScript to be run on multiple browsers. As bebel-node transforms the JS code of the latest version into that of the older version so that Node.JS is able to understand the language, Webpack executes the same process on the front-end side, transforming the written code into the highly compatible code and packing them into one or more bundles.

(many frameworks and libraries offer the pre-set dev environment configured by Webpack so that developers rarely has chance to create any new configuration of Webpack by their own)

To start creating the Webpack bundler for the project, you need to install webpack and webpack-cli, and then create _webpack.config.js_ file on the root directory.

```
npm install webpack webpack-cli -D
```

```javascript
const path = require("path");

const $BASE_ENTRY_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: $BASE_ENTRY_JS + "main.js",
    moviePlayer: $BASE_ENTRY_JS + "moviePlayer.js",
    recorder: $BASE_ENTRY_JS + "recorder.js",
    movieUploader: $BASE_ENTRY_JS + "movieUploader.js",
    commentSection: $BASE_ENTRY_JS + "commentSection.js",
    imageUploader: $BASE_ENTRY_JS + "imageUploader.js",
    movieRating: $BASE_ENTRY_JS + "movieRating.js",
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
};
```

### Back-end

#### Express.js

Express.js, a JavaScript framework, helps create the back-end of the application using usual JavaScript syntaxes.


```
npm install express
```

Since the module is installed, it is possible to start an applicaton right away.

```javascript
// ./src/app.js

import express from "express"; // or const express = require("express");

const app = express();
const heroku = process.env.NODE_ENV || null;
const $PORT = heroku ? process.env.PORT : 3000;
// if the application is run by heroku, take the given port number,
// otherwise, the port number for the application (in the dev mode) should be 3000.

app.get("/", (req, res) => {
  return res.send("hi!");
});
// send a string "hi" to the path "/"

app.listen($PORT, () => {
  console.log(`The application is listening to the port ${$PORT}.`);
});
```

The express module offers Router() method that creates new router objects connected to appropriate paths, and you can send middlewares/contorller to execute at the exact path.

```javascript
// ./src/controllers/globalControllers.js

export const home = (req, res) => {
  // all the express middlewares receive request and response objects as they are called.
  return res.end();
  // end() method simply ends the connection sending nothing.
};
```

```javascript
// ./src/routers/globalRouter.js

import express from "express";
import { home } from "../controllers/globalControllers.js";

const globalRouter = express.Router();

globalRouter.route("/").get(home);

export default globalRouter;
```

```javascript
// ./src/app.js

/*
...
*/

app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/movies", movieRouter);
app.use("/api", apiRouter);

/*
...
*/
```

There are hundreds of useful objects inside the express object so you will need to browse the document to find what you require [here](https://expressjs.com/en/4x/api.html).

#### MongoDB

The application requires a database to remember users, videos they update, and comments they added possibly so that I connected this app to a mongo atlas using _mongoose_ module which helps make this process so easy.

```
npm install mongoose
```

```javascript
// ./src/db.js

import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const mongoUri = process.env.MONGO_URI;

try {
  mongoose.connect(mongoUri);
  console.log("✅ connected to the database");
} catch (error) {
  console.log(error.message);
  console.log("❗️ cannot access the database");
}
```

The _connect()_ method of mongoose tries to be connected to the mongoDB if you already created your mongoDB account and the mongo atlas. In this case, the exact URI of the mongo atlas is required, but this shouldn't be exposed to the public, rather be saved in _dot.env_ file and used as a property of the _process.env_ object inside the application. Above the _dotenv_ module enables you to use data written in the _dot.env_ file.

The connection can be failed with thousands of reasons, so the error must be handled with _try ... catch_ statement. And export this db.js to the app.js file to execute.

```javascript
// ./src/app.js

import "./db";

/*
...
*/
```

```
npm run dev:server
✅ connected to the database
The application is listening to the port 3000.
```

Now the application has its own database, but the data the application might require have no shape. _mongoose_ has Schema object that helps creating **models** which describe the blueprint of the data.

```javascript
// ./src/models/Movie.js

import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  path: { type: String, requried: true },
  title: { type: String, required: true },
  note: { type: String, required: true },
  rating: { type: Number, required: true },
  year: { type: Number, required: true },
  genres: [String],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
```

As such, you can, for example, decide which contents the data must include and which types those contents must be. And here the data that's created through _movieSchema_ will be saved with name of "Movie" to the mongo atlas, which is quite a way to organize your database so simply.

Since the Movie model is exported by default, it is now possible to CRUD movie data using the databse in other controllers of the application.

```javascript
// ./src/controllers/movieControllers.js

/*
...
*/

export const postEditMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year) {
      return res.status(400).redirect(`/movies/${id}/edit`);
    }
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(400).redirect("/");
    }
    await Movie.findByIdAndUpdate(id, {
      path: movie.path,
      title,
      note,
      rating,
      year,
      genres: genres ? genres.split(",").map((genre) => genre.trim()) : [],
    });
    return res.status(400).redirect(`/movies/${id}`);
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/movies/${id}`);
  }
};

/*
...
*/
```

Above the _postEditMovie_ controller receives the _id_ as the parameter and informations for the video file to post from the request object. And the prototype _model_ of mongoose could search for interested data on the database using that _id_ and the _findById()_ method as well as update the data using _findByIdAndUpdate()_ method.

mongoose offers varied kinds of methods to do such CRUD role. Look into the official document [here](https://mongoosejs.com/docs/api/model.html).

#### multer and express.static()

#### Amazon S3 Bucket

#### Authentication and express-session

OAuth with Naver, session, bcrypt ...

### Front-end

#### Webpack

#### Fetching

#### Styling File Inputs

## Challenges

### create middlewares

Controllers created inside the express application receives not only two arguments of _request_ and _response_ objects but also the third argument, which is _next_ method.
Controllers that ends by calling _next()_ doesn't end the routing actually, rather continues the process of routing until the application finally finds itself refering _response_ with ending properties or methods.
Thus we could create some controllers that do not end the connection by using _next()_, which now could be called *middlewares*, and make them perform their specific roles on required spots of the whole routing process.

```javascript
// ./src/middlewares
export const urlLogger = (req, res, next) => {
  // middleware that logs the recent path
  const { path } = req;
  console.log(`Path: ${path}`);
  return next();
};

export const timeLogger = (req, res, next) => {
  // middleware that logs the date of when the route happens
  const date = new Date(Date.now());
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  console.log(`Time: ${y}.${m}.${d}`);
  return next();
};

export const securityLogger = (req, res, next) => {
  // middleware that defines if the environment uses the https protocol or not
  const { protocol } = req;
  const security = protocol === "https" ? "Secure" : "Insecure";
  console.log(security);
  return next();
};

export const protectorMiddleware = (req, res, next) => {
  // middleware that redirect users if they try to reach "/protected" path
  const { path } = req;
  return path === "/protected" ? res.redirect("/") : next();
};
```

```javascript
// ./src/app.js
/*
...
*/
app.get("/", urlLogger, timeLogger, securityLogger, (req, res) => {
  return res.send("hi");
});

app.get("/protected", protectorMiddleware, () => {
  return res.send("hey get the fuck out");
});
/*
...
*/
```

### create routes

### render pages by using pug

