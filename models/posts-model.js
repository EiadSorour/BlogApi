const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    
    title: {
        type: String,
        required: true
    },
    
    content: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("post" , postsSchema);
module.exports = Post;