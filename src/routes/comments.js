const express = require('express');
const router = express.router();
const authenticate = require('../middlewares/authenticate')
const { createComment, getCommentByPost, deleteComment } = require('../controllers/commentController');
const authenticate = require('../middlewares/authenticate');

router.post('/:postId/comments', authenticate, createComment);

router.get('/:postId/comments', getCommentByPost);

router.delete('/comments/:id', authenticate, deleteComment);

module.exports = router;