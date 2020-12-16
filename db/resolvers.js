const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  console.log(user);
  const { id, name, email, lastName } = user;
  return jwt.sign({ id, name, email, lastName }, secret, { expiresIn });
};
//resolver
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET);
      return userId;
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;
      console.log(input);
      //revisa si el usuario ya existe
      const userFind = await Users.findOne({ email });
      if (userFind) {
        throw new Error("El usuario ya esta Registrado");
      }

      const salt = await bcryptjs.genSalt(6);
      input.password = await bcryptjs.hash(password, salt);

      try {
        //guardar en la base de datos
        const usuario = new Users(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      const userFind = await Users.findOne({ email });
      if (!userFind) {
        throw new Error("El usuario no existe");
      }
      const passwordRight = await bcryptjs.compare(password, userFind.password);
      if (!passwordRight) {
        throw new Error("Su contraseña es Incorrecta");
      }
      //crear el token
      return {
        token: createToken(userFind, process.env.SECRET, "24h"),
      };
    },
  },
};

module.exports = resolvers;
