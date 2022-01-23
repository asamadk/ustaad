const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        lowercase : true,
        unique : true,
        required : 'Email is required',
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password : {type : String},
    isActive : {type : Boolean},
    lastLogin : {type : Date},
    firstName : {type : String},
    lastName : {type : String},
    mobile : {type : String},
    roleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Role'
    },
    passwordResetToken : {type : String},
    feePaidFlag : {type : Boolean},
    classRoomId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Classroom'
    },
    batchId : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Batch'
        }
    ],
    locationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'District'
    }
});

module.exports = mongoose.model('User',userSchema);

