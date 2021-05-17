const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("Hello user")
// })

router.post('/signup',(req,res)=>{
    const {name, email, password} = req.body
    if(!email || !name || !password){
        res.status(422).json({error: "Please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            res.status(422).json({error: "user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                name,
                email,
                password: hashedpassword
            })
            user.save()
            .then(user=>{
                res.json({message:"Saved Successfully"})
            })
            .cathc(err=>{
                console.log(err)
            })
        })

    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const{email,password} = req.body
    if(!email | !password){
        req.status(422).json({error:"Please add Email or password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
            .then(doMatch =>{
                if(doMatch){
                    // We are commenting the below line because rather than giving successfull message we should give user a unique token
                    // res.json({message:"Successfully Signed in"})
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    res.json({token})
                }
                else{
                    return res.status(422).json({error:"Invalid Email or Password"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
    })
})

module.exports = router