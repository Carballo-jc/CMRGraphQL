require("dotenv").config({ path: ".env" });
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conecteDB = require("./config/db-config");
const jwt = require("jsonwebtoken");
const {SECRETKEY} = process.env
//coneccion
conecteDB();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(token, SECRETKEY);
        // console.log(user);
        return {
          user,
        };
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    }
  },
});

//arrancar el server
server.listen().then(({ url }) => {
  console.log(`servidor corriendo en el puerto ${url}`);
});
