const express = require("express");
const router = express.Router();
const { createPost, getPosts, getPostById, deletePost } = require("../controllers/postsController");
const authenticate = require("../middlewares/authenticate");

// Rotas protegidas e públicas
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", authenticate, createPost);
router.delete("/:id", authenticate, deletePost);

module.exports = router;
