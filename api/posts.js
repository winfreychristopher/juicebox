const { request, response } = require('express');
const express =  require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db')

postsRouter.use((request, response, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.get('/', async (request, response) => {
    const posts = await getAllPosts();

    response.send({
        posts
    });
});

module.exports = postsRouter;