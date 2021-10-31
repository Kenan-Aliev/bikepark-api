const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/user.js");
const User = require("../models/user");
const Bike = require("../models/bike.js");
const rand = require("random-key");
const messages = require("../messages/index");

/**
 * @swagger
 *   components:
 *        securitySchemes:
 *            bearerAuth:
 *               type: http
 *               scheme: bearer
 *               bearerFormat: JWT 
 */


/**
 * @swagger
 * tags:
 *   name: OrderRoutes
 *   description: Orders managing API
 */

/**
 * @swagger
 * /order/new:
 *   post:
 *     summary: Returns a message about new success order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                phone:
 *                  type: string
 *                addressOfClient:
 *                  type: string
 *                addressOfAdmin:
 *                  type: string
 *                madeAt:
 *                  type: string
 *                  format: date
 *                expiresAt:
 *                  type: string
 *                  format: date
 *                bikes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      bikeId:
 *                        type: string
 *                      price:
 *                        type: number
 *
 *
 *     responses:
 *        400:
 *           description: Returns a message about invalid token or if bike is rented
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns a success message about new order
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *
 *
 */

router.post("/new", userMiddleware, async (req, res) => {
  let {
    name,
    phone,
    addressOfClient,
    addressOfAdmin,
    bikes,
    madeAt,
    expiresAt,
  } = req.body;
  try {
    const user = await User.findOne({ _id: req.user.id });
    for (let i = 0; i < bikes.length; i++) {
      const candidate = await Bike.findOne({ _id: bikes[i].bikeId });
      if (candidate) {
        if (candidate.isRented) {
          if (i !== 0) {
            for (let j = 0; j < i; j++) {
              const previousCandidate = await Bike.findOne({
                _id: bikes[j].bikeId,
              });
              if (previousCandidate) {
                previousCandidate.isRented = false;
                previousCandidate.rentedAmount -= 1;
                await previousCandidate.save();
              } else {
                continue;
              }
            }
          }
          return res
            .status(400)
            .json({ message: `Велосипед ${candidate.name} арендован` });
        } else {
          candidate.isRented = true;
          candidate.rentedAmount += 1;
          await candidate.save();
        }
      } else {
        continue;
      }
    }

    const totalPrice = bikes.reduce((acc, rec) => {
      return acc + rec.price;
    }, 0);
    const orderNumber = rand.generateDigits(8);
    madeAt = new Date(madeAt).toISOString();
    expiresAt = new Date(expiresAt).toISOString();
    user.orders = [
      ...user.orders,
      {
        name,
        phone,
        addressOfClient,
        addressOfAdmin,
        bikes,
        orderNumber,
        totalPrice,
        madeAt,
        expiresAt,
      },
    ];

    await user.save();
    return res.status(200).json({ message: messages.order.newOrder.success });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: messages.server.error, error });
  }
});

/**
 * @swagger
 * /order/getUsersOrders:
 *   get:
 *     summary: Returns all orders of user
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *        400:
 *           description: Returns a message about invalid token
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns an object with user orders
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userOrders:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                        orderNumber:
 *                          type: number
 *                        totalPrice:
 *                          type: number
 *                        madeAt:
 *                          type: string
 *                          format: date
 *                        expiresAt:
 *                          type: string
 *                          format: date
 *                        bikes:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                              price:
 *                                type: number
 *                              bikeId:
 *                                type: object
 *                                properties:
 *                                  _id:
 *                                    type: string
 *                                  name:
 *                                    type: string
 *                                  brand:
 *                                    type: string
 */

router.get("/getUsersOrders", userMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).populate(
      "orders.bikes.bikeId",
      "name brand"
    );
    const { orders } = user;
    return res.status(200).send({ userOrders: orders });
  } catch (error) {
    return res.status(500).json({ message: messages.server.error, error });
  }
});

/**
 * @swagger
 * /order/extend:
 *   post:
 *     summary: Returns a message about success extending an order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                orderNumber:
 *                  type: number
 *                endTime:
 *                  type: string
 *                  format: date
 
 *     responses:
 *        400:
 *           description: Returns a message about invalid token or if order is not found
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns a success message about extending an order
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *
 *
 */

router.put("/extend", userMiddleware, async (req, res) => {
  let { orderNumber, endTime } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    const idx = user.orders.findIndex(
      (order) => order.orderNumber === orderNumber
    );
    if (idx > -1) {
      endTime = new Date(endTime);
      const expiresDate = new Date(user.orders[idx].expiresAt);
      const diff = endTime.getHours() - expiresDate.getHours();
      user.orders[idx].expiresAt = endTime.toISOString();
      await user.save();
      return res
        .status(200)
        .json({ message: `Вы успешно продлили заказ на ${diff} час(a,ов)` });
    } else {
      return res.status(400).json({ message: messages.order.extend.notFound });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: messages.server.error, error });
  }
});

/**
 * @swagger
 * /order/cancel/{orderNumber}:
 *   delete:
 *     summary: Returns a message about canceling an order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: The order number
 *     responses:
 *        400:
 *           description: Returns a message about invalid token
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns a message about success canceled order
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *
 */

router.delete("/cancel/:orderNumber", userMiddleware, async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.id });
    const orderIdx = await user.getOrder(orderNumber);
    for (let i = 0; i < user.orders[orderIdx].bikes.length; i++) {
      const bikeId = user.orders[orderIdx].bikes[i].bikeId;
      const bike = await Bike.findOne({ _id: bikeId });
      bike.isRented = false;
      await bike.save();
    }
    return res.status(200).json({ message: messages.order.cancel.success });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: messages.server.error });
  }
});
module.exports = router;
