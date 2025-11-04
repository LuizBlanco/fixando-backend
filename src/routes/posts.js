const express = require ('express');
const { createPost, getPosts } = require('../controllers/postsController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/', authenticate, createPost);

router.get('/', getPosts);

module.exports = router;

