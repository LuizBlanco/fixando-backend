const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload de imagens para posts
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Envia uma imagem para ser usada em um post
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *       400:
 *         description: Nenhum arquivo enviado
 */


router.post('/post', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'Upload feito!', imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Erro no upload' });
  }
});

module.exports = router;
// 