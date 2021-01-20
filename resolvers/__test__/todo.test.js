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
  
  it('should handle errors if login token is invalid or not provided', async () => {

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

    expect(res.body.errors[0].message).toEqual("Please proide a valid token!")
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
      expect(res.body.errors[0].message).toEqual("Invalid input!")
      expect(res.body.errors[0].errors[0].message).toEqual("Title can not be empty")

  });

})

describe("TEST FETCHING SINGLE TODO BELONGING TO A USER", () => {
  it('should handle errors if login token is invalid or not provided', async () => {
    const fetchTodoQuery = {
      query: `
        {
          fetchTodo(id: "600788b4e6e6cd08dc4faa18"){
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
      .send(fetchTodoQuery)

    expect(res.body.errors[0].message).toEqual("Please proide a valid token!")
    expect(res.body.errors[0].status).toEqual(401)
  });

  it('should handle errors if objectID is invalid', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")
    const fetchTodoQuery = {
      query: `
        {
          fetchTodo(id: "334invalid-mongoose-id666"){
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
      .send(fetchTodoQuery)

    expect(res.body.errors[0].status).toEqual(400)
    expect(res.body.errors[0].message).toEqual("Invalid input!")
    expect(res.body.errors[0].errors[0].message).toEqual("Invalid mongoose ObjectID")
  });

  it('should return 404 if todo cant be found', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")
    const fetchTodoQuery = {
      query: `
        {
          fetchTodo(id: "600788b4e6e6cd08dc4faa18"){
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
      .send(fetchTodoQuery)

    expect(res.body.errors[0].status).toEqual(404)
    expect(res.body.errors[0].message).toEqual("Todo not found!")
  });

  
  it('should prevent access to other user\s todo', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")
    const user2 = await global.signup("johnny@gmail.com", "pass12345")
  
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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const fetchTodoQuery = {
      query: `
      query fetchUserTodo($todoId: ID!) {
          fetchTodo(id: $todoId){
            id
            title
            description
            status
          }
        }
      `,
      variables: {
        todoId
      }
    };
    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user2)
      .send(fetchTodoQuery)

    expect(resp.body.errors[0].status).toEqual(403)
    expect(resp.body.errors[0].message).toEqual("Forbidden!")
  });

  
  it('should fetch todo successfully for authorized user', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")
  
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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const fetchTodoQuery = {
      query: `
      query fetchUserTodo($todoId: ID!) {
          fetchTodo(id: $todoId){
            id
            title
            description
            status
          }
        }
      `,
      variables: {
        todoId
      }
    };
    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user1)
      .send(fetchTodoQuery)

    expect(resp.statusCode).toEqual(200)
    expect(resp.body.data.fetchTodo.title).toEqual('Task 1')
  });

})

describe("TEST FETCHING ALL TODOS ALL TODOS", () => {
  it('Should fetch todos for logged in user', async () => {
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
  
    await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(createTodoQuery)

    const fetchTodosQuery = {
      query: `
        {
          fetchTodos{
            totalTodos
            todos {
              id
              title
              description
              status
            }
          }
        }
      `,
    };
    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(fetchTodosQuery)

    expect(resp.statusCode).toEqual(200)
    expect(resp.body.data.fetchTodos.totalTodos).toEqual(1)
    expect(resp.body.data.fetchTodos).toHaveProperty('todos')
  });
})

describe("TEST USER's TODO UPDATE", () => {
  it('should only allow logged in users update todo', async () => {
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

    const todoId = res.body.data.createTodo.id

    const updateTodoQuery = {
      query: `
        mutation {
          updateTodo(id: "${todoId}", todoInput: {title: "Task 1", description: "Task 1 details"}) {
            id
            title
            description
            status
          }
        }
      `,
    };

    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', "invalid-token-here")
      .send(updateTodoQuery)

    expect(resp.body.errors[0].message).toEqual("Please proide a valid token!")
    expect(resp.body.errors[0].status).toEqual(401)
  });

  it('should handle errors if inputs are invalid', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")

    const updateTodoQuery = {
      query: `
        mutation {
          updateTodo(id: "600788b4e6e6cd08dc4faa18", todoInput: {title: "", description: "Task 1 details", status: "random"}) {
            id
            title
            description
            status
          }
        }
      `,
    };

    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(updateTodoQuery)

    expect(resp.body.errors[0].status).toEqual(400)
    expect(resp.body.errors[0].message).toEqual("Invalid input!")
    expect(resp.body.errors[0].errors[0].message).toEqual("Title can not be empty")
    expect(resp.body.errors[0].errors[1].message).toEqual("STATUS must either be COMPLETED or PENDING")
  });

  it('should return 404 if todo is not found', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")

    const updateTodoQuery = {
      query: `
        mutation {
          updateTodo(id: "600788b4e6e6cd08dc4faa18", todoInput: {title: "Task 1 update", description: "Task 1 details", status: "completed"}) {
            id
            title
            description
            status
          }
        }
      `,
    };

    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(updateTodoQuery)

    expect(resp.body.errors[0].status).toEqual(404)
    expect(resp.body.errors[0].message).toEqual("Todo not found!")
  });
  

  it('should not update todo if user is not authorized', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")
    const user2 = await global.signup("john@gmail.com", "pass12345")

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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const updateTodoQuery = {
      query: `
        mutation {
          updateTodo(id: "${todoId}", todoInput: {title: "Task 1", description: "Task 1 details", status: "completed"}) {
            id
            title
            description
            status
          }
        }
      `,
    };

    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user2)
      .send(updateTodoQuery)

    expect(resp.body.errors[0].status).toEqual(403)
    expect(resp.body.errors[0].message).toEqual("Forbidden!")
  });


  it('should update todo succcessfully for authorized user', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")

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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const updateTodoQuery = {
      query: `
        mutation {
          updateTodo(id: "${todoId}", todoInput: {title: "Task 2", description: "description updated", status: "completed"}) {
            id
            title
            description
            status
          }
        }
      `,
    };

    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user1)
      .send(updateTodoQuery)

    expect(resp.statusCode).toEqual(200)
    expect(resp.body.data.updateTodo.title).toEqual('Task 2')
    expect(resp.body.data.updateTodo.description).toEqual('description updated')
    expect(resp.body.data.updateTodo.status).toEqual('completed')
  });
})

describe("DELETING TODO'S BY OWNER", () => {
  it('should only allow logged in users to delete todo', async () => {
    const deleteTodoQuery = {
      query: `
        mutation{
          deleteTodo(id: "600788b4e6e6cd08dc4faa18")
        }
      `,
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', "invalid-token-here")
      .send(deleteTodoQuery)

    expect(res.body.errors[0].message).toEqual("Please proide a valid token!")
    expect(res.body.errors[0].status).toEqual(401)
  });

  it('should handle errors if objectID is invalid', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")
    const deleteTodoQuery = {
      query: `
        mutation{
          deleteTodo(id: "334invalid-mongoose-id666")
        }
      `,
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(deleteTodoQuery)

    expect(res.body.errors[0].status).toEqual(400)
    expect(res.body.errors[0].message).toEqual("Invalid input!")
    expect(res.body.errors[0].errors[0].message).toEqual("Invalid mongoose ObjectID")
  });

  it('should return 404 if todo cant be found', async () => {
    const token = await global.signup("samm@gmail.com", "pass12345")
    const deleteTodoQuery = {
      query: `
        mutation {
          deleteTodo(id: "600788b4e6e6cd08dc4faa18")
        }
      `,
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', token)
      .send(deleteTodoQuery)

    expect(res.body.errors[0].status).toEqual(404)
    expect(res.body.errors[0].message).toEqual("Todo not found!")
  });

  
  it('should prevent access to other user\s todo', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")
    const user2 = await global.signup("johnny@gmail.com", "pass12345")
  
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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const deleteTodoQuery = {
      query: `
        mutation {
          deleteTodo(id: "${todoId}")
        }
      `,
    };
    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user2)
      .send(deleteTodoQuery)

    expect(resp.body.errors[0].status).toEqual(403)
    expect(resp.body.errors[0].message).toEqual("Forbidden!")
  });

  it('should delete todo successfully for authorized user', async () => {
    const user1 = await global.signup("samm@gmail.com", "pass12345")
  
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
      .set('Authorization', user1)
      .send(createTodoQuery)

    const todoId = res.body.data.createTodo.id

    const deleteTodoQuery = {
      query: `
        mutation {
          deleteTodo(id: "${todoId}")
        }
      `,
    };
    const resp = await request(app)
      .post('/graphql')
      .set('Authorization', user1)
      .send(deleteTodoQuery)

    expect(resp.body.data.deleteTodo).toBe(true)
  });

})
