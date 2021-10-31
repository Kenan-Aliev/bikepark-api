const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const regEmail = require("../emails/registration");
const messages = require("../messages/index");
const { registerValidators } = require("../utils/validators");
const keys = require("../keys/index");
const router = Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *       type: object
 *       required:
 *          - email
 *          - username
 *          - phone
 *          - password
 *       properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id by MongoDB
 *          email:
 *            type: string
 *            unique: true
 *          username:
 *            type: string
 *            unique: true
 *            min: 3
 *            max: 15
 *          phone:
 *            type: string
 *            example: "+996553484837"
 *          role:
 *            type: string
 *            default: user
 *          password:
 *            type: string
 *            min: 6
 *            max: 56
 *          orders:
 *            type: array
 *            items:
 *                type: object
 *                properties:
 *                   _id:
 *                      type: string
 *                      description: The auto-generated id by MongoDB
 *                   orderNumber:
 *                      type: number
 *                      description: The auto generated number by server
 *                   name:
 *                      type: string
 *                      description: The name of the customer
 *                   phone:
 *                      type: string
 *                      description: Phone of the customer
 *                   addressOfClient:
 *                      type: string
 *                      description: Where to deliver the bike
 *                   addressOfAdmin:
 *                      type: string
 *                      description: Where to bring back the bike
 *                   totalPrice:
 *                      type: number
 *                      description: Total price of order
 *                   madeAt:
 *                      type: string
 *                      format: date
 *                      example: 2019-05-17
 *                   bikes:
 *                         type: array
 *                         items:
 *                              type: object
 *                              properties:
 *                                          _id:
 *                                            type: string
 *                                            description: The auto-generated id by MongoDB
 *                                          bikeId:
 *                                            type: string
 *                                          price:
 *                                            type: string
 */

/**
 * @swagger
 * tags:
 *   name: UserAuthorization
 *   description: Authorization managing API
 */

/**
 * @swagger
 * /auth/registration:
 *    post:
 *     summary: Returns message about activation registration on user email
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties :
 *                     email :
 *                        type: string
 *                     username:
 *                        type: string
 *                     phone:
 *                        type: string
 *                     password:
 *                        type: string
 *              required:
 *                     - email
 *                     - username
 *                     - phone
 *                     - password
 *              example:
 *                     {
 *                       email: "kenan1999@gmail.com",
 *                       username: "kenan",
 *                       phone: "+996553484837",
 *                       password: "k2vrrtz"
 *                     }
 *     responses:
 *        422:
 *           description : Some User Schema validation error
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *
 *        200:
 *           description: Returns a message about confirming registration on user email
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *
 *
 *
 *
 */
const transporter = nodemailer.createTransport(
  {
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: keys.EMAIL_FROM,
      pass: keys.EMAIL_PASS,
    },
  },
  {
    from: `Bike Park <${keys.EMAIL_FROM}>`,
  }
);

router.post("/registration", registerValidators, async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).send({ message: validationErrors.array()[0].msg });
    }
    const { email, username, phone, password } = req.body;
    const token = jwt.sign(
      { email, username, phone, password },
      keys.SECRET_KEY,
      { expiresIn: "3m" }
    );
    transporter.sendMail(regEmail(email, token), (err, info) => {
      if (err) {
        return res.status(500).send({
          message: messages.auth.registration.sendMailError,
          err: err.message,
        });
      } else {
        return res.status(200).json({
          message: messages.auth.registration.sendMailSuccess,
          info,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: messages.server.error, error });
  }
});

/**
 * @swagger
 * /auth/activation:
 *   post:
 *     summary: Returns message about user registration on website
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
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
 *           description: Returns a success message about user registration
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

router.post("/activation", async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, keys.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.message.includes("jwt expired")) {
        return res
          .status(400)
          .json({ message: messages.auth.activation.tokenExpired });
      } else {
        return res
          .status(400)
          .json({ message: messages.auth.token.wrongToken });
      }
    } else {
      const { email, username, phone, password } = decoded;
      bcrypt.hash(password, 8, (err, hashPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ message: messages.auth.activation.hashError });
        } else {
          new User({
            email,
            username,
            phone,
            orders: [],
            password: hashPassword,
          })
            .save()
            .then((response) =>
              res.status(200).json({
                message: messages.auth.activation.RegistrationSuccess,
                response,
              })
            )
            .catch((err) =>
              res.status(500).json({
                message: messages.auth.activation.RegistrationFailed,
                err,
              })
            );
        }
      });
    }
  });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Returns decoded token with user's data
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *        404:
 *           description: Returns a message if email or password doesn't match
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
 *           description: Returns a success login message and user's some data
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  id:
 *                    type: string
 *                  email:
 *                    type: string
 *                  token:
 *                    type: string
 *
 *
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (!candidate) {
      return res
        .status(404)
        .json({ message: messages.auth.login.emailNotExists });
    }
    bcrypt.compare(password, candidate.password, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: messages.auth.login.compareError, err });
      } else if (!result) {
        return res
          .status(404)
          .json({ message: messages.auth.login.wrongPassword });
      } else {
        const token = jwt.sign(
          {
            id: candidate._id,
            email: candidate.email,
            role: candidate.role,
          },
          keys.SECRET_KEY,
          { expiresIn: "24h" }
        );
        return res.status(200).json({
          message: messages.auth.login.successLogin,
          id: candidate._id,
          email,
          token,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: messages.server.error, error });
  }
});

module.exports = router;
