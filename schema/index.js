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

  type Todos {
    totalTodos: Int!
    todos: [Todo!]!
  }

  type FriendsTodos{
    isInvited: Boolean
    totalTodos: Int!
    todos: [Todo!]!
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

  type respMessage {
    message: String!
    todos: [Todo!]!
    totalTodos: Int!
  }


  type RootQuery {
    fetchTodo(id: ID!): Todo!
    fetchTodos: Todos
    fetchFriendsTodos(friendsEmail: String!): FriendsTodos
  }

  type RootMutation {
    createTodo(todoInput: TodoInputData): Todo!
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, todoInput: TodoInputData): Todo!
    signUp(userData: userInputData!): AuthResponse!
    signIn(userData: userInputData!): AuthResponse!
    inviteFriend(friendsEmail: String!): String!
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

module.exports = schema;