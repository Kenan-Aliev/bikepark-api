const jwt = require("jsonwebtoken");
const messages = require("../messages/index");
const keys = require("../keys/index");

module.exports = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, keys.SECRET_KEY, (error, decoded) => {
    if (error) {
      if (error.message.includes("jwt expired")) {
        return res
          .status(400)
          .json({ message: messages.auth.token.tokenExpired });
      } else {
        return res
          .status(400)
          .json({ message: messages.auth.token.wrongToken });
      }
    } else {
      if (decoded.role === "admin") {
        next();
      } else {
        return res.status(403).json({ message: messages.bike.admin.noAccess });
      }
    }
  });
};
