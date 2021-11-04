const { Router } = require("express");
const router = Router();
const Bike = require("../models/bike");
const adminMiddleware = require("../middlewares/admin");
const messages = require("../messages/index");
const bikeMiddleware = require("../middlewares/bike");
const normalizeBikeName = require("../utils//normalizeBikeName");

router.post("/add", adminMiddleware, async (req, res) => {
  const {
    name,
    brand,
    img,
    price,
    color,
    frameMaterial,
    frameSize,
    wheelsSize,
  } = req.body;
  try {
    const candidate = await Bike.findOne({ name: name.toLowerCase().trim() });
    if (candidate) {
      return res.status(400).json({ message: messages.bike.admin.bikeExists });
    }
    const newBike = new Bike({
      name: name.toLowerCase().trim(),
      brand: brand.trim(),
      img,
      price,
      color,
      frameMaterial,
      frameSize,
      wheelsSize,
    });
    await newBike.save();
    return res.status(200).json({ message: messages.bike.admin.successAdd });
  } catch (error) {
    return res.status(500).json({ message: messages.server.error, error });
  }
});

router.get("/getAll", bikeMiddleware, (req, res) => {
  Bike.find({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: messages.server.error, err });
    }
    result = normalizeBikeName(result, "bike");
    return res.status(200).json({ bikes: result });
  }).lean();
});

router.get("/getFiltered", async (req, res) => {
  try {
    const arr = Object.keys(req.query).filter(
      (query) => req.query[query].toLowerCase() !== "Все".toLowerCase()
    );
    let filtered = [];
    switch (arr.length) {
      case 1:
        filtered = await Bike.find({ [arr[0]]: req.query[arr[0]] }).lean();
        break;
      case 2:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
        }).lean();
        break;
      case 3:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
          [arr[2]]: req.query[arr[2]],
        }).lean();
        break;
      case 4:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
          [arr[2]]: req.query[arr[2]],
          [arr[3]]: req.query[arr[3]],
        }).lean();
        break;
      default:
        filtered = await Bike.find({}).lean();
        break;
    }
    filtered = normalizeBikeName(filtered, "bike");
    return res.status(200).json({ filtered });
  } catch (err) {
    return res.status(500).json({ message: messages.server.error });
  }
});

module.exports = router;
