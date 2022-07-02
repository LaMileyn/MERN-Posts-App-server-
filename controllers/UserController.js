import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req,res) =>{
    try {
        const user = await UserModel.findOne( { email:  req.body.email })
        if (!user){
            return res.status(404).json({
                message : "Пользователь не найден"
            })
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isPasswordValid){
            return res.status(404).json({
                message : "Пароли не совпадают"
            })
        }

        const token = jwt.sign({
            _id : user._id
        },'secret',{
            expiresIn : "30d"
        })
        const { passwordHash , ...userData} = user._doc
        res.status(200).json({
            ...userData,
            token

        })
    }catch (e){
        res.status(500).json({
            message : "Не удалось авторизоваться"
        })
    }
}
export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash : passwordHashed,
        })
        const user = await doc.save()
        const token = jwt.sign({
            _id : user._id
        },'secret',{
            expiresIn : "30d"
        })

        const { passwordHash , ...userData} = user._doc
        res.status(200).json({
            ...userData,
            token

        })
    } catch (e) {
        res.status(200).json({
            message: e.message
        })
    }
}
export const getMe = async (req,res) => {
    try{
        const user  = await UserModel.findById(req.userId)
        if (!user ){
            return res.status(404).json({
                message : "Пользователь не найден"
            })
        }
        const { passwordHash, ...userData } = user._doc
        res.json(userData)
    } catch (err){
        console.log(err)
    }
}