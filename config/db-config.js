require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const {DB_MONGO}= process.env;

const conecteDB = () => {
  try {
    mongoose.connect(DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DB conectada");
  } catch (error) {
    console.log("hubo un error de coneccion");
    console.log(error);
    process.exit(1);
  }
};
module.exports = conecteDB;
