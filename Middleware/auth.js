const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../Models/User')

module.exports = (req,res,next) => {
    if(!req.headers.authorization){
        return res.status(401).json({message : "No token"})
    }
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,'secret');
        User.findById(decoded.userId)
        .then(user => {
            if(!user){
                return res.status(401).json({message : "Invalid payload"})
            }
        })
        req.userData = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
}