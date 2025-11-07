const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { createPost, getPosts, getPostById, deletePost, updatePost, updateUser } = require("../controllers/postsController");

router.post("/", authenticate, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.delete("/:id", authenticate, deletePost);
router.put("/:id", authenticate, updatePost);
router.put('/:id', authenticate, updateUser);


module.exports = router;
