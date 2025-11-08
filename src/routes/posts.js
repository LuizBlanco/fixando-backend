const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const upload = require("../config/multer"); // middleware do Multer
const { createPost, getPosts, getPostById, deletePost, updatePost } = require("../controllers/postsController");

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

module.exports = router;
