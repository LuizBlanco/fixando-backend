const express = require('express');
const router = express.Router();

// Importa cada grupo de rotas
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

// Usa cada rota com seu prefixo
router.use('/users', userRoutes );
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);

module.exports = router;
