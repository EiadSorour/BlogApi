const express = require("express");

const postsController = require("../controllers/posts-controller");
const verifyToken = require("../middlewares/verifyToken");
const isAllowed = require("../middlewares/isAllowed");
const userRoles = require("../utils/userRoles");

const router = express.Router();

router.route("/")
    .get(postsController.getAllPosts)
    .post(postsController.addPost);

router.route("/:postId")
    .get(postsController.getPost)
    .patch(postsController.updatePost)
    .delete( verifyToken , isAllowed(userRoles.ADMIN , userRoles.MANAGER) , postsController.deletePost);

module.exports = router;