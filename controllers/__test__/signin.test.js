const request = require("supertest");
const app = require("../../app");

it('returns a 200 on successful signin', async () => {
  await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  const res = await request(app)
    .post('/auth/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  expect(res.statusCode).toEqual(200)
  expect(res.body.data).toHaveProperty('token')
});

it('returns a 400 on successful signin', async () => {
  await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  const res = await request(app)
    .post('/auth/signin')
    .send({
      email: 'test@test.com',
      password: 'randompass'
    })
    
  expect(res.statusCode).toEqual(400)
  expect(res.body).toHaveProperty('errors')
  expect(res.body.errors[0].message).toEqual("Wrong login credentials")
});
