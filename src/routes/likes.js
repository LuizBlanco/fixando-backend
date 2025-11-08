const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, toggleLike);

module.exports = router;
