const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const districtSchema = new Schema({
    code : {type : String},
    name : {type : String},
    stateId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'State'
    }
})

module.exports = mongoose.model('District',districtSchema);