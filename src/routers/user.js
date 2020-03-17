const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const router = new express.Router()
const multer = require('multer')

router.get('/test/', (req,res) => {
    res.send('Testing')
})

router.post('/users', async (req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    }catch(e){
        res.status(400).send(e)    
    }

})

router.get('/users', async (req,res)=>{

    try {
        const users = await User.find()
        res.send(users)
    } catch(e){
        res.status(500).send(e)
    }

    // User.find().then((users)=>{
        
    // }).catch((e)=>{
    //     res.status(500).send(error)
    // })
})

router.get('/users/me', auth, async (req,res)=>{
    res.send(req.user)
})

router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(400).send();
        }
        res.send(user)
    } catch(e) {
        res.status(500).send(e) 
    }
})

//Update users
router.patch('/users/me', auth, async (req,res) => {
    //const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error:'Invalid Updates!'})
    }

    try {
        //const user = await User.findById(_id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(_id, req.body, {new:true, runValidators:true})
        // if(!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

//Deleting user
router.delete('/users/me', auth, async(req, res)=>{
    try {
        await req.user.remove()
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

//User login
router.post('/user/login', async(req,res) => {
    try {
        const user =  await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({user, token})
        //res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//User logout
router.post('/user/logout', auth, async (req,res) => {
    try {
        req.user.tokens.filter((token) => {
           return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//User profile picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('File must be an Image'))
        }

        cb(undefined, true)
        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    //req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error:error.message})
})

router.get('/user/:id/avatar', async(req,res) => {
    const user = await User.findById(req.params.id)
    try {
        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send(e)
    }
})

router.delete('/user/me/avatar', auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send({message: 'Profile picture deleted successfully'})
}, (error, req, res, next) => {
    res.status(400).send({ error:error.message})
})

module.exports = router