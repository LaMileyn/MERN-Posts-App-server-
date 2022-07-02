import {body} from "express-validator";

export const postCreateValidation = [
    body("title","Введите заголовок статьи").isString(),
    body("text","Введите текст статьи").isLength( { min : 10 }).isString(),
    body("tags","Неверный формат тегов").optional().isString(),
    body("imageUrl","Неверная ссылка на изображение").isString()
]