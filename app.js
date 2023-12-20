const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const postsRouter = require("./routes/posts-router");
const usersRouter = require("./routes/users-router");
const httpStatusText = require("./utils/httpStatusText");

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then( ()=>{
    console.log("Connected to MongoDB database");
} );

app.use(express.json());
app.use(cors());
app.use("/uploads" , express.static(path.join(__dirname , "uploads")));
app.use("/api/posts" , postsRouter);
app.use("/api/users" , usersRouter);
app.use((error, req,res,next)=>{
    res.status(error.statusCode || 500).json({ status: error.httpStatusText || httpStatusText.ERROR , message: error.message});
});

app.all("*" , (req,res)=>{
    return res.status(404).json({ status: httpStatusText.ERROR , message: "This resource is not available" });
});

app.listen(port , ()=>{
    console.log(`Server is listening on port ${port}`);
})