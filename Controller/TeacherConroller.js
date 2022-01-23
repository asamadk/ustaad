const express = require('express');
const router = express.Router();

const TeacherService = require('../Service/TeacherService')

router.post('/batch',TeacherService.addBatch);
router.get('/notification',TeacherService.getNotification);
router.post('/fees/:studentId',TeacherService.updateStudentStatus);
router.get('/view',TeacherService.getOwnProfile);
router.get('/batch',TeacherService.getBatches);
router.get('/batch/students',TeacherService.getStudentOfOneBatch);
router.post('/batch/student/:studentId/:batchId',TeacherService.removeStudent);
router.delete('/batch/:batchId',TeacherService.deleteBatch)
router.post('/subject',TeacherService.AddSubject);
router.get('/subjects',TeacherService.getSubjects);
router.delete('/subject/:subjectId',TeacherService.deleteSubject);
router.get('/student/:studentId',TeacherService.getOneStudent);
router.put('/edit',TeacherService.updateProfile);
router.post('/broadcast/:batchId',TeacherService.broadCastToBatch);

module.exports = router;