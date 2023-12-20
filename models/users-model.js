const mongoose = require("mongoose");
const validator = require("validator");

const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail , "Invalid Email"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [userRoles.USER , userRoles.ADMIN , userRoles.MANAGER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: "profile.png"
    }
});

const User = mongoose.model("user" , userSchema);
module.exports = User;