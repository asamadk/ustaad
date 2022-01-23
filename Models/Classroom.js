const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    name : {type : String},
});

module.exports = mongoose.model('Classroom',classroomSchema);