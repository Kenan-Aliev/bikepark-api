const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/user.js");
const User = require("../models/user");
const Bike = require("../models/bike.js");
const rand = require("random-key");
const messages = require("../messages/index");





router.post("/new", userMiddleware, async (req, res) => {
  let { bikes, madeAt, expiresAt } = req.body;
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

router.get("/getUsersOrders", userMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const { orders } = user;
    return res.status(200).send({ userOrders: orders });
  } catch (error) {
    return res.status(500).json({ message: messages.server.error, error });
  }
});

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

router.delete("/cancel/:orderNumber", userMiddleware, async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const user = await User.findOne({ _id: req.user.id });
    const order = user.orders.find(
      (order) => order.orderNumber === orderNumber
    );
    for (let i = 0; i < order.bikes.length; i++) {
      const bikeName = order.bikes[i].name;
      const regexp = new RegExp(`${bikeName}`, "i");
      const bike = await Bike.findOne({ name: { $regex: regexp } });
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
