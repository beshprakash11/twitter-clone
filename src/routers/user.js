const express = require('express');
const User = require('../model/user');

//Origina Router
const router = new express.Router();

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
module.exports = router