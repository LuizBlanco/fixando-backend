const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const upload = require("../config/multer"); // middleware do Multer
const { createPost, getPosts, getPostById, deletePost, updatePost, getPostsByUser, getPostStats } = require("../controllers/postsController");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints relacionados aos posts do fórum
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retorna todos os posts (feed)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts com autor, likes e comentáriosa
 */

/**
 * @swagger
 * /api/posts/users/{id}:
 *   get:
 *     summary: Retorna todos os posts de um usuário específico
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de posts do usuário
 */

/**
 * @swagger
 * /api/posts/{id}/stats:
 *   get:
 *     summary: Retorna o número de likes e comentários de um post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do post
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estatísticas do post
 */


// Criar post com upload de imagem
router.post("/", authenticate, upload.single("image"), createPost);

// Listar todos os posts
router.get("/", getPosts);

// Buscar post por ID
router.get("/:id", getPostById);

// Deletar post (apenas autor)
router.delete("/:id", authenticate, deletePost);

// Atualizar post (apenas autor)
router.put("/:id", authenticate, updatePost);

// Buscar posts por usuário
router.get("/users/:id", getPostsByUser);

// Estatísticas de um post (likes e comentários)
router.get("/:id/stats", getPostStats);


module.exports = router;
