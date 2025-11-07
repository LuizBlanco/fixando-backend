const express = require("express");
const router = express.Router({ mergeParams: true }); // importante para pegar postId
const authenticate = require("../middlewares/authenticate");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");

// Listar comentários de um post
router.get("/:postId/comments", getCommentsByPost);

// Criar comentário em um post
router.post("/:postId/comments", authenticate, createComment);

// Deletar comentário pelo ID
router.delete("/:commentId", authenticate, deleteComment);

module.exports = router;
