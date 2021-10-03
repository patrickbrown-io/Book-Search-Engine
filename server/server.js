const express = require('express');
const path = require('path');
const routes = require('./routes');

// Bring in Apollo Server/typeDefs/Resolvers
const { ApolloServer } = require("apollo-server-express");
const {typeDefs, resolvers} = require("./schemas");

const db = require('./config/connection');
const {authMiddleware}=require('./utils/auth');


const app = express();
const PORT = process.env.PORT || 3001;

//  Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Apply Apollo as Middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("*", (req,res)=> {
  res.sendFile(path.join(__dirname,"../client/build/index.html"));
})

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
      console.log(`Now running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
