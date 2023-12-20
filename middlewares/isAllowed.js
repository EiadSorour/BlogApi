const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            const error = AppError.create("User is not authorized" , 401 , httpStatusText.FAIL);
            return next(error);
        }
        next();
    }
}