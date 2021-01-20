const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Todo {
    id: ID!
    title: String!
    description: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Todos{
    todos: [Todo!]!
    totalTodos: Int!
  }

  input TodoInputData {
    title: String!
    description: String!
    status: String
  }


  input userInputData {
    email: String!
    password: String!
  }

  type AuthResponse {
    token: String!
  }


  type RootQuery {
    fetchTodo(id: ID!): Todo!
    fetchTodos: Todos
  }

  type RootMutation {
    createTodo(todoInput: TodoInputData): Todo!
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, todoInput: TodoInputData): Todo!
    signUp(userData: userInputData!): AuthResponse!
    signIn(userData: userInputData!): AuthResponse!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

module.exports = schema;