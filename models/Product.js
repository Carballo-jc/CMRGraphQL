const mongoose = require("mongoose");

const ProductShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
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

ProductShema.index({name:'text'})

module.exports = mongoose.model("Product", ProductShema);
