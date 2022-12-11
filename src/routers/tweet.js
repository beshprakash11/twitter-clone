const express = require('express')
const Tweet = require('../model/tweet')
const router = new express.Router()
const multer = require('multer')
const auth = require('../middleware/auth')
//const findTweet = require('../middleware/findTweet')
const sharp = require('sharp')

//Helper function
const upload = multer({
    limits: {
        fileSize: 100000000
    }
})

//Create a new tweet
router.post('/tweets', auth, async (req, res) => {
    const tweet = new Tweet({
        ...req.body,
        user: req.user._id
    })
    try {
        await tweet.save()
        res.status(201).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }
})
//fetch tweets
router.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find({})
        res.send(tweets)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

//get specific tweets
router.get('/tweets/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const tweet = await Tweet.find({ user: _id })

        if (!tweet) {
            return res.status(404).send()
        }

        res.send(tweet)
    } catch (e) {
        res.status(500).send()
    }
})


//Add image tweet route
router.post('/uploadTweetImage/:id', auth, upload.single('upload'), async (req, res) => {
    const tweet = await Tweet.findOne({ _id: req.params.id })
    console.log(tweet)
    if (!tweet) {
        throw new Error('Cannot find the tweet')
    }
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer()
    console.log(buffer)
    tweet.image = buffer
    await tweet.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//fetch tweet image
router.get('/tweets/:id/image', async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)

        if (!tweet || !tweet.image) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(tweet.image)
    } catch (e) {
        res.status(404).send()
    }
})

//Like Tweets
router.put('/tweets/:id/like', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.likes.includes(req.user.id)) {
        await tweet.updateOne({ $push: { likes: req.user.id } });
        // await req.user.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("post has been liked");
        console.log('it has been liked');
        } else {
            res.status(403).json("you have already liked this post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Unlike Tweets
router.put('/tweets/:id/unlike', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.likes.includes(req.user.id)) {
        await tweet.updateOne({ $pull: { likes: req.user.id } });
        // await req.user.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("post has been unliked");
        } else {
            res.status(403).json("you have already unliked this post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//fetch specific users tweets
router.get('/tweets/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const tweet = await Tweet.find({ user: _id })

        if (!tweet) {
            return res.status(404).send()
        }

        res.send(tweet)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router