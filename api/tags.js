const { request, response } = require('express');
const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((request, response, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/:tagName/posts', async (request, response, next) => {
    const {tagName} = request.params;
    
    try {
        const allTaggedPost = await getPostsByTagName(tagName);
        const taggedPosts =  allTaggedPost.filter(taggedPost => {
            if (taggedPost.active) {
                return true
            }
            if (request.user && taggedPost.author.id === request.user.id) {
                return true
            }
            return false
        })
        response.send({Posts:taggedPosts})
    } catch ({ name, message}) {
        next({ name, message})
    }
});

tagsRouter.get('/', async(request, response) => {
    const tags = await getAllTags();

    response.send({
        tags
    });
});

module.exports = tagsRouter;