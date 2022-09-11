const express = require('express');
const characterMiddleware = require('./middlewares/character.js');
const abilityMiddleware = require('./middlewares/ability.js');
const morgan = require("morgan")

const server = express();

server.use(express.json());
server.use(morgan("dev"))


server.use('/character', characterMiddleware);
server.use('/ability', abilityMiddleware);

server.get('/', (req, res) => {
  res.send('Henry Sequelize Homework');
});

module.exports = server;