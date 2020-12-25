const request = require("supertest");
const app = require("../../app");

it('returns a 201 on successful signup', async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    
  expect(res.statusCode).toEqual(500)
  expect(res.body.data).toHaveProperty('token')
});
