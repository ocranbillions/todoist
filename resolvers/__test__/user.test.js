const request = require("supertest");
const app = require("../../app");

describe("TEST SIGNUP", () => {
  it('should signup new user with valid input data', async () => {
  
    const graphqlQuery = {
      query: `
        mutation {
          signUp(userData: {email: "valid@email.com", password: "pass123"}) {
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
  
  it('should throw errors for invalid input', async () => {
    const graphqlQuery = {
      query: `
        mutation {
          signUp(userData: {email: "invalid.email.com", password: "pass"}) {
            token
          }
        }
      `,
    };
  
    const res = await request(app)
      .post('/graphql')
      .send(graphqlQuery)
  
    expect(res.body.errors[0].message,).toEqual("Invalid input!")
    expect(res.body.errors[0].status).toEqual(400)
  });
  
  it('should inform the user if email was previously used', async () => {
    const signUpQuery = {
      query: `
        mutation {
          signUp(userData: {email: "sam@gmail.com", password: "pass123"}) {
            token
          }
        }
      `,
    };
  
    await request(app)
      .post('/graphql')
      .send(signUpQuery)
  
    const signUpQuery2 = {
      query: `
        mutation {
          signUp(userData: {email: "sam@gmail.com", password: "pass123"}) {
            token
          }
        }
      `,
    };
  
    const res2 = await request(app)
    .post('/graphql')
    .send(signUpQuery2)
  
  
    expect(res2.body.errors[0].message,).toEqual("Email in use!")
    expect(res2.body.errors[0].status).toEqual(409)
  });
})


describe("TEST SIGNIN", () => {
  
  it('should be able to sign in after a successful registeration', async () => {
    const signUpQuery = {
      query: `
        mutation {
          signUp(userData: {email: "sam@gmail.com", password: "pass123"}) {
            token
          }
        }
      `,
    };
  
    await request(app)
      .post('/graphql')
      .send(signUpQuery)
  
    const signInQuery = {
      query: `
        mutation {
          signIn(userData: {email: "sam@gmail.com", password: "pass123"}) {
            token
          }
        }
      `,
    };
  
    const res2 = await request(app)
    .post('/graphql')
    .send(signInQuery)
  
  
    expect(res2.statusCode).toEqual(200)
    expect(res2.body.data.signIn).toHaveProperty('token')
  });

  it('should report incorrect login credentials', async () => {
    const graphqlQuery = {
      query: `
        mutation {
          signIn(userData: {email: "noneExistingUser@gmail.com", password: "pass1234"}) {
            token
          }
        }
      `,
    };
  
    const res = await request(app)
      .post('/graphql')
      .send(graphqlQuery)
  
    expect(res.body.errors[0].message,).toEqual("Wrong login credentials")
    expect(res.body.errors[0].status).toEqual(401)
  });

})