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

const transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
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
