// const express = require('express');
// const router = express.Router();
// const upload = require('../middlewares/uploadMiddleware');
// const authMiddleware = require('../middlewares/authenticate');

// router.post('/post', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     const imageUrl = `/uploads/${req.file.filename}`;
//     res.json({ message: 'Upload feito!', imageUrl });
//   } catch (error) {
//     res.status(500).json({ error: 'Erro no upload' });
//   }
// });

// module.exports = router;
// // 