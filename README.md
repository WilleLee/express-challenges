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
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
```

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

