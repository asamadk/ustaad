const { findById } = require("../Models/Batch");
const Batch = require("../Models/Batch");
const Notification = require("../Models/Notification");
const User = require("../Models/User");

const addStudentToBatch = (req,res) => {
    Batch.findById(req.params.batchId).then((batch) => {
        if(batch){
            User.findById(req.userData.userId).then(user => {
                user.batchId = [...user.batchId,req.params.batchId]
                user.save().then(() => {
                    res.status(200).json({message : 'Added to batch succesful'})
                })
            }).catch(err => {res.status(402).json({message : 'User id not found'})})
        }else{
            res.status(404).json({message : 'batch not found'})
        }
    }).catch(err => console.log(err))
}

const getBatches = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user){
                Batch.find({ '_id' : 
                {
                    $in : user.batchId
                }
            }).then(batch => {
                res.status(200).json(batch)
            }).catch(err => console.log(err))
            }else{
                res.status(402).json({message : 'User not found'});
            }
        })
        .catch(err => console.log(err));
    }else{
        res.status(402).json({message : 'User id not found'});
    }
}

const getTeacherOfBatch = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.batchId){
                User.find({'batchId' : 
                {
                    $in : req.params.batchId
                },classRoomId : {$ne : null}
            }).then(teacher => {
                res.status(200).json(teacher)
            }).catch(err => console.log(err))
            }else if(!req.params.batchId){
                res.status(500).json({message : 'Please provide batch id'})
            }else if(!user){
                res.status(402).json({message : 'User not found'})
            }
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'User id not found'})
    }
}

const exitBatch = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.batchId){
                console.log(user.batchId)
                if(user.batchId.includes(req.params.batchId)){
                    const newbatches = [];
                    user.batchId.map((batch => {
                        if(batch != req.params.batchId){
                            newbatches.push(batch)
                        }
                    }))
                    user.batchId = newbatches;
                    user.save().then(()=> {
                        res.status(200).json({message : 'You left this batch'})
                    }).catch(err => console.log(err))
                }else{
                    res.status(500).json({message : 'You are not enrolled in this batch'});
                }
            }else if(!user){
                res.status(402).json({message : 'User not foound'})
            }else if(!req.params.batchId){
                res.status(500).json({message : 'Please provide batch id'})
            }
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'user id not found'});
    }
}

const getOneBatch = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.batchId){
                Batch.findById(req.params.batchId).then(batch => {
                    res.status(200).json(batch)
                }).catch(err => console.log(err))
            }else if(!user){
                res.status(402).json({message : 'User not found'});
            }else if(!req.params.batchId){
                res.status(500).json({message : 'Please provide batch id'})
            }
        }).catch(err => console.log(err));
    }else{
        res.status(402).json({message : 'user id not found'})
    }
}

const getOneTeacher = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.teacherId){
                User.findById(req.params.teacherId).then(teacher => {
                    res.status(200).json(teacher);
                }).catch(err => console.log(err));
            }else if(!user){
                res.status(402).json({message : 'User not found'});
            }else if(!req.params.teacherId){
                res.status(500).json({message : 'Please provide teacher id'});
            }
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'user id not found'});
    }
}

const searchTeachers = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.query.name){
                User.find({"firstName" : 
                { 
                    '$regex' : req.query.name ,
                    '$options' : 'i',
                },classRoomId : {
                    $ne : null
                }
                }).then(teachers => {
                    res.status(200).json(teachers)
                }).catch(err => console.log(err))
            }else if(!user){
                res.status(402).json({message : 'User not found'});
            }else if(!req.params.name){
                res.status(500).json({message : 'Please provide something'});
            }
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'user id not found'});
    }
}

const updateProfile = (req,res) => {
    const {
        firstName , 
        lastName,
        mobile,
        locationId
    } = req.body;
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
                user.firstName = firstName;
                user.lastName = lastName;
                user.mobile = mobile;
                user.locationId = locationId;
                user.save(()=>{
                    res.status(200).json({message : 'User Updated',user})
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'User id not found'});
    }
}

const getOwnProfile = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({message : 'User not found'})
            }
        }).catch(err => console.log(err));
    }else{
        res.status(404).json({message : 'User id not found'})
    }
}

const getNotification = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user){
                Notification.find({'receiverIds' : 
                {
                    $in : userId
                }
            }).then(notification => {
                res.status(200).json(notification)
            }).catch(err => console.log(err));
            }else{
                res.status(404).json({message : 'User not found'})
            }
        }).catch(err => console.log(err));
    }else{
        res.status(404).json({message : 'User id not found'})
    }
}

module.exports = {
    addStudentToBatch,
    getBatches,
    getTeacherOfBatch,
    exitBatch,
    getOneBatch,
    getOneTeacher,
    searchTeachers,
    updateProfile,
    getOwnProfile,
    getNotification
}