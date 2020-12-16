const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conecteDB = require("./config/db-config");

//coneccion
conecteDB();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//arrancar el server
server.listen().then(({ url }) => {
  console.log(`servidor corriendo en el puerto ${url}`);
});
