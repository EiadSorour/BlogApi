const bcrypt = require("bcryptjs");

const User = require("../models/users-model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");
const jwtGenerator = require("../utils/jwtGenerator");

const getAllUsers = asyncWrapper(
    async (req,res,next)=>{
        const users = await User.find({} , {"__v":false, "password":false});
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: {users} });
    }
);

const register = asyncWrapper(
    async (req,res,next)=>{
        console.log(req.file);
        const {firstName , lastName , email, password , role} = req.body
        const oldUser = await User.findOne({email: email});
        if(oldUser){
            const error = AppError.create("User already exist" , 400 , httpStatusText.FAIL);
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            role,
            password: hashedPassword,
            avatar: req.file.filename
        });
        await user.save();

        const token = await jwtGenerator({email: user.email, id: user._id , role: user.role});
        return res.status(201).json({ status: httpStatusText.SUCCESS , data: {token} });
    }
);

const login = asyncWrapper(
    async (req,res,next)=>{
        const {email,password} = req.body;
        if(!email || !password){
            const error = AppError.create("Email and Password are required" , 400, httpStatusText.FAIL);
            return next(error);
        }

        const user = await User.findOne({email:email});
        if(!user){
            const error = AppError.create("User doesn't exist" , 400, httpStatusText.FAIL);
            return next(error);
        }

        const matchedPasswords = await bcrypt.compare(password, user.password);
        if(matchedPasswords){
            const token = await jwtGenerator({email: user.email, id: user._id, role: user.role});
            return res.status(200).json({ststus: httpStatusText.SUCCESS , data:{token} });
        }else{
            const error = AppError.create("wrong password" , 400, httpStatusText.FAIL);
            return next(error);
        }
    }
);

module.exports = {
    getAllUsers,
    register,
    login
}