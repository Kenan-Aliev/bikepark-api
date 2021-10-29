const { Router } = require("express");
const router = Router();
const Bike = require("../models/bike");
const adminMiddleware = require("../middlewares/admin");
const messages = require("../messages/index");

/**
 *@swagger
 * components:
 *    schemas:
 *      Bike:
 *       type: object
 *       required:
 *          - name
 *          - brand
 *          - price
 *       properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id by MongoDB
 *          name:
 *            type: string
 *            unique: true
 *          img:
 *            type: string
 *          brand:
 *            type: string
 *          isRented:
 *            type: boolean
 *            default: false
 *          rentedAmount:
 *            type: number
 *            default: 0
 *          price:
 *            type: number
 *          color:
 *            type: string
 *          frameMaterial:
 *            type: string
 *          frameSize:
 *            type: number
 *          wheelsSize:
 *            type: number
 *
 */

/**
 * @swagger
 * tags:
 *   name: BikeRoutes
 *   description: Bike managing API
 */

/**
 * @swagger
 * /bike/add:
 *   post:
 *     summary: Adding a new bike to data base and returning a message about it
 *     tags: [BikeRoutes]
 *     parameters:
 *       - in: headers
 *         name: Authorization
 *         schema:
 *              type: string
 *              required: true
 *         example: Bearer `${token}`
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                brand:
 *                  type: string
 *                img:
 *                  type: string
 *                price:
 *                  type: number
 *                color:
 *                  type: string
 *                frameMaterial:
 *                  type: string
 *                frameSize:
 *                  type: number
 *                wheelsSize:
 *                  type: number
 *     responses:
 *        400:
 *           description: Returns an error message if bike exists or invalid token
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns no access message, if you are not admin
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
 *           description: Returns a success message about adding new bike
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

/**
 * @swagger
 * /bike/getAll:
 *   get:
 *     summary: Returns all bikes
 *     tags: [BikeRoutes]
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
 *           description: Returns a success message about adding new bike
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  bikes:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Bike'
 *
 *
 *
 *
 */

/**
 * @swagger
 * /bike/getFiltered:
 *   get:
 *     summary: Returns filtered bikes by parameters
 *     tags: [BikeRoutes]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *            type: string
 *         description: The name of brand
 *       - in: query
 *         name: wheelsSize
 *         schema:
 *            type: number
 *         description: The size of wheels
 *       - in: query
 *         name: frameSize
 *         schema:
 *            type: string
 *         description: The size of frame
 *       - in: query
 *         name: isRented
 *         schema:
 *            type: boolean
 *         description: Status of bike(rented or not)
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
 *           description: Returns an array of filtered bikes
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  bikes:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Bike'
 *
 *
 *
 *
 */

router.get("/getAll", (req, res) => {
  Bike.find({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: messages.server.error, err });
    }
    result = result.map((bike) => {
      if (bike.name.includes(" ")) {
        const bikeName = bike.name
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.substr(1))
          .join(" ");
        return { ...bike, name: bikeName };
      } else {
        const bikeName = bike.name[0].toUpperCase() + bike.name.substr(1);
        return { ...bike, name: bikeName };
      }
    });
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
        filtered = await Bike.find({ [arr[0]]: req.query[arr[0]] });
        break;
      case 2:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
        });
        break;
      case 3:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
          [arr[2]]: req.query[arr[2]],
        });
        break;
      case 4:
        filtered = await Bike.find({
          [arr[0]]: req.query[arr[0]],
          [arr[1]]: req.query[arr[1]],
          [arr[2]]: req.query[arr[2]],
          [arr[3]]: req.query[arr[3]],
        });
        break;
      default:
        filtered = await Bike.find({});
        break;
    }
    return res.status(200).json({ filtered });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
