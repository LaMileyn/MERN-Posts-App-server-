import mongoose from "mongoose";
import express from 'express'
import {loginValidation, registerValidation} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {login, register} from "./controllers/UserController.js";
import {create, getAll, getOne, remove, update} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/posts.js";
import multer from "multer"
import handleValidationErrors from "./utils/handleValidationErrors.js";


const app = express()
app.use(express.json())
app.use('/uploads',express.static("uploads"))

const storage = multer.diskStorage({
    destination : (_,__,cb) =>{
        cb(null,"uploads")
    },
    filename : (_,file,cb) =>{
        cb(null,file.originalname)
    }
})
const upload = multer( { storage })
mongoose.connect(
    "mongodb+srv://admin:mongoose39mongoosE@cluster0.tszqy.mongodb.net/blog?retryWrites=true&w=majority"
).then(() => console.log("DB"))


app.post("/auth/register", registerValidation,handleValidationErrors, register)
app.post("/auth/login", loginValidation, handleValidationErrors ,login)
app.get('/auth/me',checkAuth, checkAuth)


app.post("/upload", checkAuth ,upload.single('image'), (req,res) =>{
    res.json({
        url : `/uploads/${req.file.originalname}`
    })
})

// posts

app.get("/posts", checkAuth, getAll)
app.get("/posts/:id", checkAuth, getOne)
app.post("/posts", checkAuth, postCreateValidation, create)
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, update)
app.delete("/posts/:id", checkAuth, remove)


app.listen(5000, () => console.log("Успех"))