const express = require ('express');
const { createPost, getPosts } = require('../controllers/postsController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();


router.post('/', authenticate, createPost);

router.get('/', getPosts);

router.get('/:id', getPostById);

router.delete('/:id', authenticate, deletePost); 


module.exports = router;

