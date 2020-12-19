const { gql } = require("apollo-server");

//schema
const typeDefs = gql`
  #types
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    create: String
  }
  type Product {
    id: ID
    name: String
    existence: Int
    price: Float
    create: String
  }
  type Token {
    token: String
  }
  type Client {
    id: ID
    name: String
    lastName: String
    email: String
    company: String
    phone: String
    seller: ID
  }
  #Inputs
  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }
  input AuthToken {
    email: String!
    password: String!
  }
  input ProductInput {
    name: String!
    existence: Int!
    price: Float!
  }
  input ClientInput {
    name: String!
    lastName: String!
    email: String!
    company: String!
    phone: String
  }

  #Mutation
  type Mutation {
    #User
    newUser(input: UserInput): User
    authUser(input: AuthToken): Token

    #Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    #client
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String
  }
  #Querys
  type Query {
    #user
    getUser(token: String!): User
    #Products
    getProducts: [Product]
    getProduct(id: ID!): Product
    #clientes
    getClients: [Client] #obtener todos los clientes
    getClient(id: ID!): Client #obtener los clientes del user logeado
    getClientSeller: [Client] #onbtener los clientes del vendedor
  }
`;
module.exports = typeDefs;
