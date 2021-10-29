const { Router } = require("express");
const Bike = require("../models/bike");
const messages = require("../messages/index");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: FilterRoutes
 *   description: Filters managing API
 */


/**
 * @swagger
 * /filters/getAll:
 *   get:
 *     summary: Returns filters for bikes
 *     tags: [FilterRoutes]
 *     responses:
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
 *           description: Returns an object with filters' arrays
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  brands:
 *                    type: array
 *                    items:
 *                      type: string
 *                  wheelsSizes:
 *                    type: array
 *                    items:
 *                      type: number
 *                  frameSizes:
 *                    type: array
 *                    items:
 *                      type: number    
 */

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
