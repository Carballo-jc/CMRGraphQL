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
    stock: Int
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
  type Order {
    id:ID
    order:[OrderGroup]
    total: Float
    client:ID
    seller:ID
    date:String
    status: StatusOrder
  }
  type OrderGroup {
        id: ID
        cuantity: Int
        name: String
        price: Float
  }
  type TopClients{
    total:Float
    client:[Client]
  }
  type TopSeller{
    total:Float
    seller:[User]
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
    stock: Int!
    price: Float!
  }
  input ClientInput {
    name: String!
    lastName: String!
    email: String!
    company: String!
    phone: String
  }
  input OrderProductInput {
        id: ID
        cuantity: Int
        name: String
        price: Float
  }
  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client:ID
    status:StatusOrder
  }
  enum StatusOrder {
    PENDIENTE
    COMPLETADO
    CANCELADO
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
    #Order
    getAllOrder:[Order]
    getOrderBySeller:[Order]
    getOrderById(id:ID!):Order
    getOrderStatus(status:String!):[Order]

    #busquedas avanzadas
    bestClients:[TopClients]
    bestSeller:[TopSeller]
    getProductName(text:String!):[Product]
    
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
    #Order
    newOrder(input: OrderInput): Order
    updateOrder(id:ID!,input:OrderInput):Order
    deleteOrder(id:ID!):String
  }

`;
module.exports = typeDefs;
