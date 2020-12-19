const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  state: {
    type: String,
    default: "PENDIENTE",
  },
  create: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", OrderSchema);
