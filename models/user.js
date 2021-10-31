const { Schema, model, ObjectId } = require("mongoose");

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
          bikeId: {
            type: ObjectId,
            ref: "bikes",
          },
          price: Number,
        },
      ],
      orderNumber: Number,
      phone: String,
      name: String,
      addressOfClient: String,
      addressOfAdmin: String,
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

userSchema.methods.getOrder = function (orderNumber) {
  const orders = [...this.orders];
  const idx = orders.findIndex((order) => order.orderNumber === +orderNumber);
  return idx;
};

module.exports = model("users", userSchema);
