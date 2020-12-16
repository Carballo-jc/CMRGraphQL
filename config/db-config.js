const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conecteDB = () => {
  try {
    mongoose.connect(process.env.DB_MONGO, {
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
