const express = require('express');
const router = express.Router();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

router.use('/users', userRoutes );
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);

module.exports = router;
