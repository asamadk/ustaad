const mongoose = require('mongoose');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Role = require('../Models/Role');
const Classroom = require('../Models/Classroom');
const { transporter } = require('../Helper/nodeMailer');
const crypto = require('crypto');

const registerUser = async (req,res) => {
    const {
        firstName , 
        lastName, 
        email, 
        password,
        confirmPassword,
        roleId,
        mobile,
        locationId
    } = req.body;

    if(!firstName || !lastName || !email || !password || !confirmPassword || !roleId){
        return res.status(404).json({
            message : 'Please fill all the details'
        })
    }
    if(password !== confirmPassword){
        return res.status(401).json({
            message : 'passwords do not match'
        })
    }

    User.findOne({email : email}).then(user => {
        if(user){
            return res.status(402).json({
                message : 'User already exist with this email'
            })
        }
    })

    Role.findById(roleId).then(role => {
        if(role && role.name === 'TEACHER'){
            const classRoom = new Classroom({
                name : `${firstName} ${lastName}'s Classroom`
             })
            classRoom.save().then(classroom => {
                console.log(classroom._id);
                const newUser = new User({
                    email,
                    lastName, 
                    firstName , 
                    password,
                    roleId,
                    classRoomId : classroom._id,
                    isActive : true,
                    mobile,
                    passwordResetToken : null,
                    locationId,
                    batchId : []
                });
                bcrypt.genSalt(10, (err ,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            res.status(200).json(newUser);
                        }).catch(err =>{
                            console.error(err)
                            res.status(500).json(err.errors)
                        })
                    })
                })        
            })
        }else if(role && role.name != 'TEACHER'){
            const newUser = new User({
                email,
                lastName, 
                firstName , 
                password,
                roleId,
                classRoomId : null,
                isActive : true,
                mobile,
                passwordResetToken : null,
                feePaidFlag : null,
                locationId,
                batchId : []
            });
            bcrypt.genSalt(10, (err ,salt) => {
                bcrypt.hash(newUser.password,salt,(err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(()=>{
                        res.status(200).json(newUser);
                    }).catch(err =>{
                        console.error(err)
                        res.status(500).json(err.errors)
                    })
                })
            }) 
        }
    })
}

const loginService = async (req,res) => {
    const { email,password } = req.body;
    const user = await User.find({email});
    if(user.length < 1){
        return res.status(403).json({
            message : 'User not registered with us'
        });
    }
        bcrypt.compare(password,user[0].password,(err,result) => {
            if(err || !result){
                return res.status(400).json({
                    message : 'Password is incorrect'
                })
            }
            if(result){
                jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id,
                    roleId : user[0].roleId
                }, 'secret', {expiresIn : '1d'}, (err,token) => {
                    return res.status(200).json(token);
                }); 
            }
        });
}

const changePassword = (req,res) => {
    
    const email = req.body.email;
    // const resetToken = crypto.randomBytes(20).toString('hex');
    const otp = Math.random().toString().slice(2,8);

    if(email){
        User.find({email : email}).then((user) => {
            if(user.length > 0 && user.length == 1){
                user[0].passwordResetToken = otp;
                user[0].save().then(() => {
                    mailService(email,otp,res);
                }).catch(err => console.log(err));
            }else if(user.length > 1){
                console.log('Multiple users found with same address');
            }else{
                res.status(404).json({message : 'No user found with email'})
            }
        }).catch(err => console.log(err));
    }else{
        res.status(404).json({message : 'Please provide an email id'})
    }
}

const mailService = (email,otp,res) => {
    const mailData = {
        from : 'abdul.samad@dhwaniris.com',
        to : email,
        subject : 'Password reset',
        html : '<p>OTP for password reset is : <b>'+otp+'</b></p>'
    }
    transporter.sendMail(mailData,(err,info) => {
        if(err){
            console.log(err)
            res.status(500).json({message : 'Something went wrong'})
        }else{
            res.status(200).json({message : 'A mail has been sent to your registered email'});
        }
    })
}

const resetPassword = (req,res) => {
    const password = req.body.password;
    const otp = req.body.otp;
    const email = req.body.email;
    if(!otp || !password){
        res.status(500).json({message : 'please fill all the details'})
    }else{
        User.find({'email' : email}).then(user => {
            if(user.length < 1){
                res.status(404).json({message : 'User not found'})
            }else if(user.length == 1){
                if(user[0].passwordResetToken == otp){
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) => {
                            if(err)throw err;
                            user[0].password = hash;
                            user[0].passwordResetToken = null;
                            user[0].save().then(()=>{
                                res.status(200).json({message : 'Password changes succesfully'})
                            })
                        })
                    })
                }else{
                    res.status(402).json({message : 'Otp invalid'});
                }
            }
        }).catch(err => console.log(err))
    }
}

module.exports = {
    registerUser,
    loginService,
    changePassword,
    resetPassword
}