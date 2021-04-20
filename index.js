const PORT = 3000;
const { response, request } = require('express');
const express = require('express');
const server = express();


const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));


server.use((request, response, next) => {
    console.log("<____Body Logger START____>");
    console.log(request.body);
    console.log("<_____Body Logger END_____>");

    next();
});