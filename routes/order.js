const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/user.js");
const User = require("../models/user");
const Bike = require("../models/bike.js");
const rand = require("random-key");
const messages = require("../messages/index");
const keys = require("../keys/index");
const orderMiddleware = require("../middlewares/order");

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
                previousCandidate.rentedUntil = undefined;
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
          candidate.rentedUntil = expiresAt;
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
        status: "Выполняется",
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

router.get(
  "/getUsersOrders",
  userMiddleware,
  orderMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id })
        .populate("orders.bikes.bikeId", "name brand")
        .lean();
      const { orders } = user;
      const currentOrders = orders.filter((order) => {
        return order.status?.toLowerCase() === "Выполняется".toLowerCase();
      });

      const completedOrders = orders.filter((order) => {
        return order.status?.toLowerCase() === "Завершен".toLowerCase();
      });
      return res.status(200).send({ currentOrders, completedOrders });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: messages.server.error, err });
    }
  }
);

router.put("/extend", userMiddleware, async (req, res) => {
  let { orderNumber, endTime } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    const idx = user.orders.findIndex(
      (order) => order.orderNumber === orderNumber
    );
    if (idx > -1) {
      for (let i = 0; i < user.orders[idx].bikes.length; i++) {
        const bike = await Bike.findOne({
          _id: user.orders[idx].bikes[i].bikeId,
        });
        bike.rentedUntil = endTime;
        await bike.save();
      }
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

router.delete("/cancel/:orderNumber", userMiddleware, async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.id });
    const orderIdx = await user.getOrder(orderNumber);
    for (let i = 0; i < user.orders[orderIdx].bikes.length; i++) {
      const bikeId = user.orders[orderIdx].bikes[i].bikeId;
      const bike = await Bike.findOne({ _id: bikeId });
      bike.rentedUntil = undefined;
      bike.isRented = false;
      await bike.save();
    }
    user.orders[orderIdx].status = "Завершен";
    await user.save();
    return res.status(200).json({ message: messages.order.cancel.success });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: messages.server.error });
  }
});
module.exports = router;
