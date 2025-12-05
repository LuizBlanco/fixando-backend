const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Endpoints de curtidas em posts
 */

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Dá ou remove like em um post
 *     tags: [Likes]
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
 *                 example: 2
 *     responses:
 *       200:
 *         description: Like adicionado ou removido
 *       400:
 *         description: ID inválido ou post não encontrado
 */

/**
 * @swagger
 * /api/likes/{postId}:
 *   get:
 *     summary: Retorna todos os likes de um post
 *     tags: [Likes]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID do post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de likes do post
 */


router.post('/', authenticate, toggleLike);

module.exports = router;
