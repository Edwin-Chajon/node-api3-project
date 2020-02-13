const express = require('express');
const helmet = require("helmet");

const PostReuter = require("./users/userRouter");

const server = express();

// This is the GLOBAL middleware
server.use(express.json());
server.use(helmet());
//server.use(logger);


//routes - (endpoints)
// middleware that applies to a set of routes
// also is local middleware
server.use("/api/users",logger , PostReuter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware


function logger(req, res, next) { console.log(`${req.method} Request to ${req.originalUrl} on ${Date()}`);next()}


module.exports = server;
