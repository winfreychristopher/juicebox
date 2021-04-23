const { request, response } = require('express');
const express =  require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, getPostById, updatePost } = require('../db');
const usersRouter = require('./users');
const { requireUser } = require('./utils');

postsRouter.use((request, response, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.post('/', requireUser, async (request, response, next) => {
   const { title, content, tags = "" } = request.body;

   const tagArr = tags.trim().split(/\s+/)
   const postData = {};

   if (tagArr.length) {
       postData.tags = tagArr;
   }

   try {
       const {id} = request.user;
       postData.content = content;
       postData.title = title;
       postData.authorId = id;
       
       const post = await createPost(postData);
       if (post) {
           response.send({ post })
       } else {
           next({
               name: "Can'tFindPostError",
               message: "NoMatchPosts"
           });
       }
   } catch ({ name, message }) {
       next({ name, message })
   }
});

postsRouter.patch('/:postId', requireUser, async (request, response, next) => {
    const {postId} = request.params;
    const {title, content, tags} = request.body;
    const updateFields = {};

    if (tags && tags.length > 0) {
        updateFields.tags = tags.trim().split(/\s+/);
    }

    if (title) {
        updateFields.title = title;
    }

    if (content) {
        updateFields.content = content;
    }

    try {
        const originalPost = await getPostById(postId);
        if (originalPost.author.id === request.user.id) {
            const updatedPost = await updatePost(postId, updateFields);
            response.send({ post: updatedPost })
        } else {
            next({
                name:'UnauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

postsRouter.delete('/:postId', requireUser, async (request, response, next) => {
    try {
        const post = await getPostById(request.params.postId);

        if (post && post.author.id === request.user.id) {
            const updatedPost = await updatePost(post.id, { active: false });

            response.send({ post: updatedPost });
        } else {
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            } : {
                name: "PostNotFoundError",
                message: "That post does not exist"
            });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

postsRouter.get('/', async (request, response, next) => {
    try {
        const allPosts = await getAllPosts();

		const posts = allPosts.filter(post => {

			if (post.active) {
				return true;
			}
			if(request.user && post.author.id === request.user.id) {
				return true;
			}
			return false;
		});

        response.send({
       		posts
    	});

    } catch ({name, message}) {
        next({ name, message })
    }
});

module.exports = postsRouter;