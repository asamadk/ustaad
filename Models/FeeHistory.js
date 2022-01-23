const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeHistorySchema = new Schema({
    dueDate : {type : Date},
    lastSubmittedDate : {type : Date},
    userID : {type : Number},
    paymentMode : {type : String}
})

module.exports = mongoose.model('FeeHistory',feeHistorySchema);