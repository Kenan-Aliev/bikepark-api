const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();
const messages = require("./messages/index");
const authRoutes = require("./routes/auth");
const bikeRoutes = require("./routes/bike.js");
const orderRoutes = require("./routes/order");
const filterRoutes = require("./routes/filters");
const keys = require("./keys/index");

const server = express();
const expressWs = require("express-ws")(server);
const awss = expressWs.getWss();
const chatFunction = require("./chat/index");

server.ws("/chat", chatFunction(awss));

const PORT = keys.PORT;
const dbUrl = keys.DB_URL;

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "BikePark API",
      version: "1.0.0",
      description: "Express BikePark API",
    },
    servers: [
      {
        url: keys.BASE_URL,
      },
    ],
  },
  apis: ["./swagger/*.js"],
};

const specs = swaggerJsDoc(options);

server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
server.use(cors());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

server.use("/auth", authRoutes);
server.use("/bike", bikeRoutes);
server.use("/order", orderRoutes);
server.use("/filters", filterRoutes);

const start = () => {
  mongoose.connect(
    dbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) {
        console.log(messages.server.mongoErrors.connectionError);
      } else {
        server.listen(PORT, () => {
          console.log(`${messages.server.started} ${PORT}`);
        });
      }
    }
  );
};

start();
