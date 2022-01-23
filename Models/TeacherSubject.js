const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSubjectSchema = new Schema({
    subjectName : {type : String}
})

module.exports = mongoose.model('TeacherSubject',teacherSubjectSchema);