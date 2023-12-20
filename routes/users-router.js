const express = require("express");
const multer = require("multer");

const usersController = require("../controllers/users-controller");
const verifyToken = require("../middlewares/verifyToken");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

const diskStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null , "uploads");
    },
    filename: (req,file,cb)=>{
        const extension = file.mimetype.split("/")[1];
        const fileName = `user-${Date.now()}.${extension}`;
        cb(null,fileName);
    }
});

const fileFilter = (req,file,cb)=>{
    const fileType = file.mimetype.split("/")[0];
    if(fileType === "image"){
        cb(null, true);
    }else{
        cb(AppError.create("Uploaded avatar must be an image" , 400 , httpStatusText.FAIL),false);
    }
}

const router = express.Router();
const upload = multer({storage: diskStorage , fileFilter:fileFilter});

router.route("/")
    .get(verifyToken , usersController.getAllUsers);

router.route("/register")
    .post( upload.single("avatar"),  usersController.register);

router.route("/login")
    .get(usersController.login);

module.exports = router;