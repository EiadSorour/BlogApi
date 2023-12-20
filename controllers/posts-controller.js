const Post = require("../models/posts-model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");

const getAllPosts = asyncWrapper( 
    async (req,res,next)=>{
        const allPosts = await Post.find({},{"__v": false});
        return res.status(200).json( {status: httpStatusText.SUCCESS , data: {posts: allPosts} } ); 
    }
);

const getPost = asyncWrapper( 
    async (req,res,next)=>{
        const postId = req.params.postId;
        const post = await Post.findById(postId , {"__v": false});
        if(!post){
            const error = AppError.create("Post Not Found", 404 ,httpStatusText.FAIL);
            return next(error);
        }
        return res.status(200).json( {status: httpStatusText.SUCCESS , data: {post} } );
    }
);

const addPost = asyncWrapper(
    async (req,res,next)=>{
        const post = new Post({...req.body});
        await post.save();
        return res.status(201).json( {status: httpStatusText.SUCCESS , data: {post}} );
    }
);

const updatePost = asyncWrapper( 
    async (req,res,next)=>{
        const postId = req.params.postId;
        const oldPost = await Post.findById(postId);
        if(!oldPost){
            const error = AppError.create("Post Not Found",404,httpStatusText.FAIL);
            return next(error);        
        }
        const updatedPost = await Post.findByIdAndUpdate(postId , {...req.body}, {returnDocument:"after"});
        return res.status(200).json( {status: httpStatusText.SUCCESS , data: {post: updatedPost}} );
    }
);

const deletePost = asyncWrapper(
    async (req,res,next)=>{
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if(!deletedPost){
            const error = AppError.create("Post Not Found", 404, httpStatusText.FAIL);
            return next(error);
        }
        return res.status(200).json( {status: httpStatusText.SUCCESS , data:null} );
    }
);

module.exports = {
    getAllPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}