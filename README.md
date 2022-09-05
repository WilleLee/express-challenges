# express-challenges

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

