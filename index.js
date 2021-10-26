const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();
const messages = require("./messages/index");
const authRoutes = require("./routes/auth");
const bikeRoutes = require("./routes/bike.js");
const orderRoutes = require("./routes/order");

const PORT = process.env.PORT || 8080;
const dbUrl = process.env.DB_URL;

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
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsDoc(options);

const server = express();

server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({extended: true, limit: '5mb'}))

server.use("/auth", authRoutes);
server.use("/bike", bikeRoutes);
server.use("/order", orderRoutes);

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
