const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const resolver = require('./resolvers');
const bodyParser = require('body-parser');
const auth = require("./middlewares/authorization")

const app = express();

app.use(bodyParser.json())

app.use(auth)

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const errors = err.originalError.errors;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      // return { message: message, status: code, errors: errors };

      const locations = err.locations;
      const path = err.path;
      return { message: message, status: code, errors, locations, path };
    }
  })
);

module.exports = app;
