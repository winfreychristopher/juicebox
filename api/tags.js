const { request, response } = require('express');
const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');

tagsRouter.use((request, response, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async(request, response) => {
    const tags = await getAllTags();

    response.send({
        tags:[]
    });
});

module.exports = tagsRouter;