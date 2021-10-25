const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  orders: [
    {
      bikes: [
        {
          name: String,
          brand: String,
          bikeType: String,
          price: Number,
        },
      ],
      orderNumber: Number,
      totalPrice: Number,
      madeAt: Date,
      expiresAt: Date,
    },
  ],
  password: {
    type: String,
    required: true,
  },
});

module.exports = model("users", userSchema);
