const request = require("supertest");
const app = require("../../app");

it('should signup new user with valid input data', async () => {
  
  const graphqlQuery = {
    query: `
      mutation {
        signUp(userData: {email: "valid@email.com", password: "correctPassword"}) {
          token
        }
      }
    `,
  };

  const res = await request(app)
    .post('/graphql')
    .send(graphqlQuery)
  expect(res.statusCode).toEqual(200)
  expect(res.body.data.signUp).toHaveProperty('token')
});

it('should inform the user if email was previously used', async () => {
  
});

it('should throw error for invalid input', async () => {
  
});

it('should return a catch server errors', async () => {
  
});
