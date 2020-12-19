const Users = require("../models/Users");
const Products = require("../models/Products");
const Clients = require("../models/Clients");
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
    getProducts: async () => {
      try {
        const products = await Products.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }) => {
      const product = await Products.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      return product;
    },
    getClients: async () => {
      try {
        const clients = await Clients.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const client = await Clients.findById(id);
      //revisar si el cliente no existe
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      //quien lo creo
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      return client;
    },
    getClientSeller: async (_, {}, ctx) => {
      try {
        const clients = await Clients.find({ seller: ctx.user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
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
    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Products(input);
        const product = await newProduct.save();
        return product;
      } catch (error) {
        console.log("Hubo un error al crear el Producto");
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Products.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      product = await Products.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return product;
    },
    deleteProduct: async (_, { id }) => {
      //revisar si el producto existe //chequear no esta revisando
      let product = await Products.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      await Products.findOneAndDelete({ _id: id });
      return "Producto Eliminado";
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      //verificar si el cliente esta registado
      const client = await Clients.findOne({ email });
      if (client) {
        throw new Error("Cliente ya esta Registrado");
      }
      const newClient = new Clients(input);
      newClient.seller = ctx.user.id;

      try {
        const addClient = await newClient.save();
        return addClient;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      //verificar si existe el cliente
      let client = await Clients.findById(id);
      // console.log(client);
      if (!client) {
        throw new Error("Ese cliente no existe");
      }
      //verificar si es el vendedor de quien edita
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      //guardar la actualizacion del cliente
      client = await Clients.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      //verificar si existe el cliente
      let client = await Clients.findById(id);
      // console.log(client);
      if (!client) {
        throw new Error("Ese cliente no existe");
      }
      //verificar si es el vendedor de quien edita
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      client = await Clients.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    },
  },
};

module.exports = resolvers;
