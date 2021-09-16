require("dotenv").config({ path: ".env" });
const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Order = require("../models/Order");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generarJWT } = require("../helpers/generar-jwt");
const { SECRETKEY } = process.env;

//resolver
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, SECRETKEY);
      return userId;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const client = await Client.findById(id);
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
        const clients = await Client.find({ seller: ctx.user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    //todas los pedidos
    getAllOrder: async () => {
      try {
        const order = await Order.find({});
        return order;
      } catch (error) {
        console.log(error);
        console.log("Hubo un error al hacer la consulta");
      }
    },
    //pedido por vendedor
    getOrderBySeller: async (_, {}, ctx) => {
      try {
        const order = await Order.find({ seller: ctx.user.id });
        return order;
      } catch (error) {
        console.log(error);
        console.log("Hubo un error al hacer la consulta");
      }
    },
    //pedido por ID
    getOrderById: async (_, { id }, ctx) => {
      const order = await Order.findById(id);
      //verificar si el pedido existe
      if (!order) {
        throw new Error("Pedido no encontrado");
      }
      //verificar si es el vendedor correspondiente
      if (order.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      return order;
    },
  },
  //Mutations
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      //revisa si el usuario ya existe
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("El usuario ya esta Registrado");
      }

      const salt = await bcryptjs.genSalt(6);
      input.password = await bcryptjs.hash(password, salt);

      try {
        //guardar en la base de datos
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("El usuario no existe");
      }
      const passwordUser = await bcryptjs.compare(password, user.password);
      if (!passwordUser) {
        throw new Error("Su contraseña es Incorrecta");
      }
      //crear el token
      return {
        token: generarJWT(user.id),
      };
    },
    //seccion de productos
    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);
        const product = await newProduct.save();
        return product;
      } catch (error) {
        console.log("Hubo un error al crear el Producto");
        console.log(error);
      }
    },

    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return product;
    },
    deleteProduct: async (_, { id }) => {
      //revisar si el producto existe //chequear no esta revisando
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no Encontrado");
      }
      await Product.findOneAndDelete({ _id: id });
      return "Producto Eliminado";
    },
    //seccion de clientes
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      //verificar si el cliente esta registado
      const client = await Client.findOne({ email });
      if (client) {
        throw new Error("Cliente ya esta Registrado");
      }
      const newClient = new Client(input);
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
      let client = await Client.findById(id);
      // console.log(client);
      if (!client) {
        throw new Error("Ese cliente no existe");
      }
      //verificar si es el vendedor de quien edita
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      //guardar la actualizacion del cliente
      client = await Client.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      //verificar si existe el cliente
      let client = await Client.findById(id);
      // console.log(client);
      if (!client) {
        throw new Error("Ese cliente no existe");
      }
      //verificar si es el vendedor de quien edita
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      client = await Client.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    },
    //seccion de pedidos
    newOrder: async (_, { input }, ctx) => {
      const id = input.client;
      //verificar si el cliente existe
      let client = await Client.findById(id);
      // console.log(ctx);
      if (!client) {
        throw new Error("Ese cliente no existe");
      }

      // verificar si el cliente es del vendedor
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }
      // Revisar que el stock este disponible
      for await (const item of input.order) {
        const { id } = item;

        const product = await Product.findById(id);

        if (item.cuantity > product.stock) {
          throw new Error(
            `El articulo: ${product.name} excede la cantidad disponible`
          );
        } else {
          // Restar la cantidad a lo disponible
          product.stock = product.stock - item.cuantity;

          await product.save();
        }
      }

      // Crear un nuevo pedido
      const newOrderAdd = new Order(input);

      // asignarle un vendedor
      newOrderAdd.seller = ctx.user.id;

      // Guardarlo en la base de datos
      const result = await newOrderAdd.save();
      return result;
    },
    // actualizar un pedido
    updateOrder: async (_, { id, input }, ctx) => {
      const { client } = input;
      //verificar si existe la orden
      const order = await Order.findById(id);
      if (!order) {
        throw new Error("Pedido no encontrado");
      }
      //verificar si existe el cliente
      const clientId = await Client.findById(client);
      if (!clientId) {
        throw new Error("cliente no existe");
      }
      //verificar si el cliente y el pedido pertenecen al vendedor
      if (clientId.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
      }

           // Revisar que el stock este disponible
           for await (const item of input.order) {
            const { id } = item;
    
            const product = await Product.findById(id);
    
            if (item.cuantity > product.stock) {
              throw new Error(
                `El articulo: ${product.name} excede la cantidad disponible`
              );
            } else {
              // Restar la cantidad a lo disponible
              product.stock = product.stock - item.cuantity;
    
              await product.save();
            }
          }
          //guardar el pedido
          const newOrder = await Order.findByIdAndUpdate({_id:id,},input,{new:true});
          return newOrder;
    },
  },
};

module.exports = resolvers;
