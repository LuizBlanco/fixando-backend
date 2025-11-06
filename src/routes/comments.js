const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");

router.post("/", authenticate, createComment);
router.get("/:postId", getCommentsByPost);
router.delete("/:id", authenticate, deleteComment);

module.exports = router;
