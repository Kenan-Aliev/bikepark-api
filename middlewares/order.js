const User = require("../models/user");

module.exports = async function (req, res, next) {
  try {
      console.log(req.user)
    const user = await User.findOne({
      _id: req.user.id,
    });
    for (let i = 0; i < user.orders.length; i++) {
      if (user.orders[i].expiresAt.getTime() < new Date().getTime()) {
        user.orders[i].status = "Завершен";
      } else {
        continue;
      }
    }
    await user.save();
    next();
  } catch (err) {
    return res.status(500).json({ message: messages.server.error, error });
  }
};
