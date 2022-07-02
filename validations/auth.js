import { body } from "express-validator";


export const registerValidation = [
    body("email","Неверный формат почты").isEmail(),
    body("password","Пароль должен быть как минимум 7 символов").isLength( { max : 16, min : 7}),
    body("fullName","Указано неверное имя").isLength({ min : 3}),
    body("avatarUrl","Неверный формат URL").optional().isURL()
]

export const loginValidation = [
    body("email","Неверный формат почты").isEmail(),
    body("password","Пароль должен быть как минимум 7 символов").isLength( { max : 16, min : 7})
]