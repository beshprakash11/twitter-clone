const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../model/user');
const auth = require('../middleware/auth')

//Origina Router
const router = new express.Router();

//Helpers
const upload = multer({
    limits: {
        fileSize: 100000000
    }
})
//Endspoints

//Create a new user
router.post('/users',async(req, res) =>{
    const user = new User(req.body);
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Fetch the users
router.get('/users',async(req, res) =>{
    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
})

//login users 
router.post('/users/login', async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete user 
router.delete("/users/:id", async (req, res) =>{
    try
    {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user){
            return res.status(400).send()
        }

        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

// Fetch a singe user
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})
//Update Users
router.patch('/users/:id', auth, upload.single('avatar'), async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'website', 'bio', 'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
//Post User Profile Imge
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    if (req.user.avatar != null) {
        req.user.avatar = null
    }
    req.user.avatar = buffer
    req.user.avatarExists = true
    await req.user.save()
    console.log(req.user.avatar)
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//get profile image
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

//Router for following
router.put('/users/:id/follow', auth, async (req, res) => {
    if (req.user.id != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            if (!user.followers.includes(req.user.id)) {
            await user.updateOne({ $push: { followers: req.user.id } });
            await req.user.updateOne({ $push: { followings: req.params.id } });
            res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you allready follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("you cant follow yourself")
    }
});

// Unfollow Users
router.put('/users/:id/unfollow', auth, async (req, res) => {
    if (req.user.id != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            if (user.followers.includes(req.user.id)) {

            await user.updateOne({ $pull: { followers: req.user.id } });
            await req.user.updateOne({ $pull: { followings: req.params.id } });
            res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you dont follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("you cant unfollow yourself")
    }
});
module.exports = router