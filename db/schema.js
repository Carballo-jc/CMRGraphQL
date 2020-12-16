const { gql } = require("apollo-server");

//schema
const typeDefs = gql`
  type Course {
    title: String
  }
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    create: String
  }
  type Token {
    token: String
  }
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
  type Mutation {
    newUser(input: UserInput): User
    authUser(input: AuthToken): Token
  }
  type Query {
    getUser(token: String!): User
  }
`;
module.exports = typeDefs;
