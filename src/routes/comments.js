const express = require("express");
const router = express.Router({ mergeParams: true }); // importante para pegar postId
const authenticate = require("../middlewares/authenticate");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");

/**
 * @swagger
 * tags:
 *   name: Comentários
 *   description: Endpoints relacionados aos comentários dos posts
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Cria um novo comentário em um post
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "Excelente post, obrigado pela dica!"
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Retorna todos os comentários de um post
 *     tags: [Comentários]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID do post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentários
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Deleta um comentário pelo ID
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do comentário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentário deletado com sucesso
 *       404:
 *         description: Comentário não encontrado
 */


// Listar comentários de um post
router.get("/:postId/comments", getCommentsByPost);

// Criar comentário em um post
router.post("/:postId/comments", authenticate, createComment);

// Deletar comentário pelo ID
router.delete("/:commentId", authenticate, deleteComment);

module.exports = router;
