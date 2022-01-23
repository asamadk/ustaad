const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSubjectMapping = new Schema({
    subjectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'TeacherSubject'
    },
    teacherId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model('TeacherSubjectMapping',teacherSubjectMapping);