const request = require("supertest");
const app = require("../../app");

it('returns a 201 on successful signup', async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  expect(res.statusCode).toEqual(201)
  expect(res.body.data).toHaveProperty('token')
});

it('returns a 400 with incorrect input', async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      email: 'wrong@email',
      password: 'dfd'
    })
    
  expect(res.statusCode).toEqual(400)
  expect(res.body).toHaveProperty('errors')
});

it('returns a 409 on if email is already used', async () => {
  await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })

  const res = await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  expect(res.statusCode).toEqual(409)
  expect(res.body).toHaveProperty('errors')
  expect(res.body.errors[0].message).toEqual("Email in use")
});
