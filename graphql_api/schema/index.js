const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Todo {
    id: ID!
    title: String!
    description: String!
    status: String!
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

  type RootQuery {
    fetchTodo(id: ID!): Todo!
    fetchTodos: Todos
  }

  type RootMutation {
    createTodo(todoInput: TodoInputData): Todo!
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, todoInput: TodoInputData): Todo!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

// {
//   fetchTodo(id: "5fec389a673cff06b80f95c8") {
//     title
//     description
//     status
//     id
//   }
// }
// {
//   fetchTodos {
//     totalTodos
//     todos {
//       id
//       title
//       description
//       status
//   	}
//   }
// }
// mutation {
//   createTodo(todoInput: {title: "GraphQl7", description: "Lets learn graphQl"}){
//     id
//     title
//     description
//     status
//   }
// }
// mutation {
// 	deleteTodo(id: "60046edb6d467b33ec78d9be")
// }
// mutation {
//   updateTodo(id: "60046ead47aaf73a54aac18f", todoInput: {title: "GraphQ20", description: "learn more graphQl", status: "completed"}){
//     id
//     title
//     description
//     status
// 	}
// }