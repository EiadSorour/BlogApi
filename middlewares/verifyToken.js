const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

module.exports = async (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if(!authHeader){
        const error = AppError.create("Token is required" , 401 ,httpStatusText.FAIL);
        return next(error);
    }

    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token , process.env.JWT_SECRET_KEY);
        req.currentUser = payload;
        return next();
    }catch(e){
        const error = AppError.create("Invalid Token" , 401 , httpStatusText.ERROR);
        return next(error)
    }
}