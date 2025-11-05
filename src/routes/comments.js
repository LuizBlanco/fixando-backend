const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');

const authenticate = require('../middlewares/authenticate');

router.post('/:postId/comments', authenticate, createComment);

router.get('/:postId/comments', getCommentsByPost);

router.delete('/comments/:id', authenticate, deleteComment);

module.exports = router;