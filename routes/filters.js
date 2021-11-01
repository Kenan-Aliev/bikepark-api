const { Router } = require("express");
const Bike = require("../models/bike");
const messages = require("../messages/index");

const router = Router();



const getFilterArr = (filterName, bikes) => {
  return bikes.reduce((acc, rec) => {
    if (!acc.includes(rec[filterName])) {
      return [...acc, rec[filterName]];
    }
    return acc;
  }, []);
};

router.get("/getAll", async (req, res) => {
  try {
    const bikes = await Bike.find({}, "brand wheelsSize frameSize");
    const filters = {
      brands: getFilterArr("brand", bikes),
      wheelsSizes: getFilterArr("wheelsSize", bikes),
      frameSizes: getFilterArr("frameSize", bikes),
    };
    return res.status(200).json(filters);
  } catch (err) {
    return res.status(500).send({ message: messages.server.error });
  }
});

module.exports = router;
