const Batch = require("../Models/Batch");
const User = require("../Models/User")
const Subject = require('../Models/TeacherSubject');
const TeacherSubjectMapping = require("../Models/TeacherSubjectMapping");
const Notification = require("../Models/Notification");

const addBatch = ((req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then((user) => {
            const {fees,description,name,timing} = req.body;
            const link = req.protocol+'://'+req.get('host')+'/student/';
            console.log(link)
            const newBatch = new Batch({
                name,
                joiningLink : link,
                schedulePdf : null,
                totalStrength : 0,
                description,
                timing,
                fees
            })
            newBatch.joiningLink = link+newBatch._id;
            user.batchId = [...user.batchId,newBatch._id];
            user.save().then(()=>{
                newBatch.save().then((batch)=>{
                    res.status(200).json(batch)
                })
            })
        }).catch((err) => {
            return res.status(500).json({message : 'No user id found'})
        })
    }
})

const getBatches = async (req,res) => {
    User.findById(req.userData.userId).then(user => {
        if(user && !req.query.filter && !req.query.id){
            Batch.find({
                '_id' : {
                    $in : user.batchId
                }
            }).then(batch => {
                res.status(200).json(batch)
            })
        }else if(user && req.query.filter && !req.query.id){
            let parameter = 0;
            if(req.query.filter === 'ASC'){
                parameter = 1;
            }else{
                parameter = -1;
            }
            Batch.find({
                '_id' : {
                    $in : user.batchId
                }
            }).sort({totalStrength : parameter}).then(batch => [
                res.status(200).json(batch)
            ])
        }else if(user && req.query.id){
            Batch.findById(req.query.id).then(batch => {
                res.status(200).json(batch);
            })
        }
    }).catch(err => res.status(500).json({message : 'User not found'}))
}

const getStudentOfOneBatch = (req,res) => {
    User.findById(req.userData.userId).then((user) => {
        if(user && req.query.id && !req.query.fee){
            User.find({
                'batchId' : {
                    $in : req.query.id
                },classRoomId : null
            }).then(user => {
                res.status(200).json(user)
            })
        }else{user && req.query.fee && req.query.id}{
            const feeStatus = true ? req.query.fee == 'P' : false;
            User.find({
                'batchId' : {
                    $in : req.query.id
                },classRoomId : null,feePaidFlag : feeStatus
            })
        }
    }).catch(err => {res.status(500).json({message : "No user id found"})})
}

const removeStudent = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then((user) => {
            if(user && req.params.studentId && req.params.batchId){
                User.findById(req.params.studentId).then(student => {
                    const newBatch = []
                    student.batchId.map(batch => {
                        if(batch!=req.params.batchId){
                            console.log('Comming here')
                            newBatch.push(batch);
                        }
                    });
                    student.batchId = newBatch;
                    student.save().then(() => {
                        res.status(200).json({message : 'Student removed'})
                    })
                }).catch(err => {console.log(err)})
            }
        }).catch(err => {res.status(402).json({message : 'User id not found'})})
    }
}

const deleteBatch = (req , res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then((user) => {
            if(user && req.params.batchId){
                Batch.findByIdAndDelete(req.params.batchId)
                .then(() => {
                    res.status(200).json({message : 'Batch deleted'})
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }else{
        res.status(402).json({message : 'User id not found'})
    }
}

const AddSubject = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.body.subjectName){
                const newSubject = new Subject({
                    subjectName : req.body.subjectName
                })
                console.log(newSubject)
                newSubject.save().then(sub => {
                    const teacherSubjectMapping = new TeacherSubjectMapping({
                        subjectId : sub._id,
                        teacherId : userId
                    })
                    teacherSubjectMapping.save().then((mapped) => {
                        res.status(200).json({message : 'Subject added',sub});
                    })
                })
            }else{
                res.status(500).json({message : "something went wrong"})
            }
        }).catch(err => console.log(err))
    }else{
        res.status(402).json({message : 'User id not found'})
    }
}

const getSubjects = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user){
                TeacherSubjectMapping.find({teacherId : userId}).then(subjects => {
                    const subjectIDs = [];
                    subjects.map(s => subjectIDs.push(s.subjectId));
                    Subject.find({'_id' : {
                        $in : subjectIDs
                    }}).then((sub) => {
                        return res.status(200).json(sub);
                    })
                })
            }else{
                return res.status(402).json({message : 'User not found'})
            }
        }).catch(err => console.log(err))
    }else{
        return res.status(402).json({message : 'User id not found'});
    }
}

const deleteSubject = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.subjectId){
                TeacherSubjectMapping.deleteOne({subjectId : req.params.subjectId,teacherId : userId}).then(()=>{
                    res.status(200).json({message : 'Subject removed'});
                }).catch(err => console.log('something went wrong'));
            }else if(!user){
                res.status(402).json({message : 'User not found'})
            }else if(!req.params.subjectId){
                res.status(500).json({message : 'Please provide subject id'})
            }
        })
    }else{
        res.status(402).json({message : 'User id not found'})
    }
}

const getOneStudent = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.studentId){
                User.findById(req.params.studentId).then(student => {
                    res.status(200).json(student)
                })
            }else if(!user){
                res.status(402).json({message : 'User not found'});
            }else if(!req.params.studentId){
                res.status(500).json({message : 'Please provide student id'});
            }
        }).catch(err => console.log(err));
    }else{
        res.status(402).json({message : 'User id not found'});
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

const broadCastToBatch = (req,res) => {
    const userId = req.userData.userId;
    const batchId = req.params.batchId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && batchId){
                Batch.findById(batchId).then(batch => {
                    User.find({'batchId':
                        {
                            $in : batchId
                        },classRoomId : null
                    }).then(users => {
                        const recivers = [];
                        users.map(u => recivers.push(u._id))
                        const newNotification = new Notification({
                            isSeen : false,
                            message : req.body.message,
                            senderId : userId,
                            receiverIds : recivers
                        });
                        newNotification.save().then(() => {
                            res.status(200).json({message : 'Notification sent to all'})
                        })
                    })
                }).catch(err => console.log(err))
            }else if(!batchId){
                res.status(404).json({message : 'Batch not found'})
            }else if(!user){
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

const updateStudentStatus = (req,res) => {
    const userId = req.userData.userId;
    if(userId){
        User.findById(userId).then(user => {
            if(user && req.params.studentId){
                User.findById(req.params.studentId).then(student => {
                    if(!student.classRoomId){
                        student.feePaidFlag = true
                        student.save().then(()=> {
                            res.status(200).json({message : 'Status updated'})
                        }).catch(err => console.log(err))
                    }else{
                        res.status(500).json({message : 'User is not student'})
                    }
                }).catch(err => console.log(err))
            }else if(!user){
                res.status(404).json({message : 'User not found'})
            }else if(!req.params.studentId){
                res.status(404).json({message : 'Please provide student id'});
            }
        }).catch(err => console.log(err));
    }else{
        res.status(404).json({message : 'User id not found'})
    }
}

module.exports = {
    addBatch,
    getBatches,
    getStudentOfOneBatch,
    removeStudent,
    deleteBatch,
    AddSubject,
    getSubjects,
    deleteSubject,
    getOneStudent,
    updateProfile,
    getOwnProfile ,
    broadCastToBatch,
    getNotification,
    updateStudentStatus
}