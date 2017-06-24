const express     = require("express");
const morgan      = require("morgan");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const cors        = require("cors");
const expressJWT  = require("express-jwt");

const app       = express();
const environment = app.get('env');
const config    = require("./config/config");
const apiRouter = require("./config/apiRoutes");
const webRouter = require("./config/webRoutes");

mongoose.connect(config.db[environment]);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use("/api", expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: "/api/register", methods: ["POST"]},
      { url: "/api/login",    methods: ["POST"]}
    ]
  }));

app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next) {
  if(err.name !== "UnauthorizedError") return next();
  return res.status(401).json({ message: "Unauthorized Request"});
}

app.use("/", webRouter);
app.use("/api", apiRouter);

app.listen(config.port, () => console.log(`The app is set up on: ${config.port}`));

module.exports = app;
