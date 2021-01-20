const request = require("supertest");
const app = require("../../app");

describe("TEST TODO CREATION", () => {
  it('should be logged in to create todo', async () => {

    const token = await global.signup("samm@gmail.com", "pass12345")
  
    const createTodoQuery = {
      query: `
        mutation {
          createTodo(todoInput: {title: "Task 1", description: "Task 1 details"}){
            id
            title
            description
            status
          }
        }
      `,
    };
  
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(createTodoQuery)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.createTodo.title).toEqual('Task 1')
  });
  
  it('should report errors if login token is invalid or not provided', async () => {

    const createTodoQuery = {
      query: `
        mutation {
          createTodo(todoInput: {title: "Task 1", description: "Task 1 details"}){
            id
            title
            description
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', "invalid-token-here")
      .send(createTodoQuery)

    expect(res.body.errors[0].message,).toEqual("Please proide a valid token!")
    expect(res.body.errors[0].status).toEqual(401)

  });
  

  it('should validate title and description fields', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")
    const createTodoQuery = {
      query: `
        mutation {
          createTodo(todoInput: {title: " ", description: "tas"}){
            id
            title
            description
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(createTodoQuery)
      
      expect(res.body.errors[0].status).toEqual(400)
      expect(res.body.errors[0].message,).toEqual("Invalid input!")
      expect(res.body.errors[0].errors[0].message).toEqual("Title can not be empty")

  });

})

describe("TEST FETCHING SINGLE TODO BELONGING TO A USER", () => {

})

describe("TEST FETCHING ALL TODOS ALL TODOS", () => {

})

describe("TEST USER's TODO UPDATE", () => {
  
})

describe("TEST TODO DELETE BY THE OWNER", () => {

})
