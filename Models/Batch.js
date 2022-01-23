const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = new Schema({
    name : {type : String},
    joiningLink : {type : String},
    schedulePdf : {type : String},
    totalStrength : {type : Number},
    description : {type : String},
    timing : {type : String},
    fees : {type : Number}
});

module.exports = mongoose.model("Batch",batchSchema);