const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    isSeen : {type : Boolean},
    receiverIds : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    message : {type : String},
    time : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('notification',notificationSchema);