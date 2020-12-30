const request = require("supertest");
const app = require("../../app");


it('returns a 201 if todo is created succefully', async () => {
  const token = await global.signup("test@test.com", "password");

  const res = await request(app)
    .post('/todo/')
    .set('Authorization', token)
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })

  expect(res.statusCode).toEqual(201)
  expect(res.body).toHaveProperty('data')
  expect(res.body.data.title).toEqual("Task 1")
  expect(res.body.data.description).toEqual("content goes here")
});

it('returns a 200 if todo is deleted succefully', async () => {
  const token = await global.signup("test@test.com", "password");

  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', token)
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .delete(`/todo/${res1.body.data.id}`)
    .set('Authorization', token)

  expect(res2.statusCode).toEqual(200)
  expect(res2.body).toHaveProperty('message')
  expect(res2.body.message).toEqual(`Todo ID: ${res1.body.data.id} has been deleted`)
});

it('returns a 200 for fetching single todo', async () => {
  const token = await global.signup("test@test.com", "password");

  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', token)
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .get(`/todo/${res1.body.data.id}`)
    .set('Authorization', token)

  expect(res2.statusCode).toEqual(200)
  expect(res2.body.data.title).toEqual("Task 1")
});

it('Should not return todo for another user', async () => {
  const user1Token = await global.signup("user1@test.com", "password");
  const user2Token = await global.signup("user2@test.com", "password");

  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', user1Token) // owner
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .get(`/todo/${res1.body.data.id}`)
    .set('Authorization', user2Token) // other user

  expect(res2.statusCode).toEqual(401)
  expect(res2.body.message).toEqual("Unauthorized")
});



it('returns a successfuly fetch user\'s own todos', async () => {
  const token = await global.signup("test@test.com", "password");

  const res = await request(app)
    .get('/todo/')
    .set('Authorization', token);
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('data')
});

it('returns a 200 if todo is updated succefully', async () => {
  const token = await global.signup("test@test.com", "password");

  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', token)
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .put(`/todo/${res1.body.data.id}`)
    .set('Authorization', token)
    .send({
      status: 'completed'
    })

  expect(res2.statusCode).toEqual(200)
  expect(res2.body).toHaveProperty('data')
  expect(res2.body.data.status).toEqual("completed")
});

it('returns a 400 if update todo does not pass validation', async () => {
  const token = await global.signup("test@test.com", "password");
  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', token)
    .send({
      title: 'Title 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .put(`/todo/${res1.body.data.id}`)
    .set('Authorization', token)
    .send({
      title: 'new title',
      description: 'update on description',
      status: 'random stuff'
    })
  expect(res2.statusCode).toEqual(400)
  expect(res2.body).toHaveProperty('errors')
  expect(res2.body.errors[0].status).toEqual("status must be 'candeled', 'deleted', OR 'pending'")
});

it('returns unauthorized on edit todo if todo doesn\'t belong to user', async () => {
  const user = await global.signup("user1@test.com", "password");
  const user2 = await global.signup("user2@test.com", "password");

  const res1 = await request(app)
    .post('/todo/')
    .set('Authorization', user)
    .send({
      title: 'Task 1',
      description: 'content goes here'
    })
    

  const res2 = await request(app)
    .put(`/todo/${res1.body.data.id}`)
    .set('Authorization', user2)
    .send({
      status: 'completed'
    });

    expect(res2.statusCode).toEqual(401)
    expect(res2.body.message).toEqual("Unauthorized")
});


it('returns a 401 if invvalid or no token is provided', async () => {
  // const token = await global.signup("test@test.com", "password");

  const res = await request(app)
    .get('/todo/')
    // .set('Authorization', token);
  expect(res.statusCode).toEqual(401)
  expect(res.body).toHaveProperty('errors')
  expect(res.body.errors[0].message).toEqual("Please proide a valid token")
});

