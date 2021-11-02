const Bike = require("../models/bike");
const messages = require("../messages/index");

module.exports = async function (req, res, next) {
  try {
    const bikes = await Bike.find({}, "rentedUntil isRented");
    for (let i = 0; i < bikes.length; i++) {
      if (bikes[i].rentedUntil?.getTime() < new Date().getTime()) {
        bikes[i].rentedUntil = undefined;
        bikes[i].isRented = false;
        await bikes[i].save()
      }
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: messages.server.error });
  }
};
