const express = require('express');
const router = express.Router();
const Post = require('./account-model');

router.get('/', async (req, res) => {
    try {
        const data = await Post.getAll()
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await Post.getById(id);
        if (!data) {
            res.status(404).json("you messed up")
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});
const validatePost = (req, res, next) => next()

router.post('/', validatePost, async (req, res) => {
    try {
        const post = req.body
        const data = await Post.create(post)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Post.delete(id)
        res.json({ message: `post with id ${id} was deleted` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;