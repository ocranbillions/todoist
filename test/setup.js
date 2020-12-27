const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')

let mongo;
beforeAll(async () => {
  process.env.JWT_SECRET = 'secret';
  process.env.NODE_ENV = "test"

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async (email, password) => {
  const response = await request(app)
    .post('/auth/signup')
    .send({
      email,
      password
    })
    .expect(201);
  
  const { token } = response.body.data;
  return token;
};
