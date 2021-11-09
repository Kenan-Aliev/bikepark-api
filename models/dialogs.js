const { Schema, model, ObjectId } = require("mongoose");

const DialogsSchema = new Schema({
  messages: [
    {
      author: {
        type: ObjectId,
        ref: "users",
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  members: [
    {
      type: ObjectId,
      ref: "users",
    },
  ],
});

module.exports = model("dialogs", DialogsSchema);
