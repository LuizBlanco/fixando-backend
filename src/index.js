const express = require('express');
const router = express.Router();

// importa e usa cada grupo de rotas
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');


router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);

module.exports = router;
