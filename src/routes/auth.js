const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de registro, login e logout dos usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cria uma nova conta de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuts"
 *               email:
 *                 type: string
 *                 example: "nuts@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já existente
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Faz login de um usuário existente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nuts@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido (retorna token JWT)
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Faz logout do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */


router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
});

module.exports = router;
