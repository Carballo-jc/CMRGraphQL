const mongoose = require("mongoose");

const ProductShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  existence: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  create: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.Model("Products", ProductShema);
