import PostSchema from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostSchema.find().populate("user").exec()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        console.log(postId)
        PostSchema.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {
                    viewsCount: 1
                }
            },
            {
                returnDocument: "after"
            }, (err, doc) => {
                if (err) {
                    return res.status(500).json({message: "Не удалось получить статю"})
                }
                if (!doc) {
                    return res.status(400).json({message: "Не удалось найти статью"})
                }
                res.json(doc)
            }).populate("user")

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostSchema.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                return res.status(500).json({message: "Не удалось удалить статью"})
            }
            if (!doc) {
                return res.status(400).json({message: "Статья не найдена"})
            }
            res.json({
                success: true
            })
        })
    } catch (e) {

    }
}
export const create = async (req, res) => {
    try {
        const doc = new PostSchema({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostSchema.findOneAndUpdate(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        )
        res.json({
            message : "success"
        })
    } catch (e) {
        res.status(500).json({message: "Не удалось обновить емае"})
    }
}