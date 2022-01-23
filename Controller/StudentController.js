const express = require('express');
const StudentService = require('../Service/StudentService');
const router = express.Router();

router.get('/batch',StudentService.getBatches);
router.get('/view',StudentService.getOwnProfile);
router.get('/batch/teacher/:batchId',StudentService.getTeacherOfBatch);
router.get('/teacher',StudentService.searchTeachers);
router.get('/teacher/:teacherId',StudentService.getOneTeacher);
router.get('/batch/:batchId',StudentService.getOneBatch);
router.get('/notification',StudentService.getNotification)
router.get('/:batchId',StudentService.addStudentToBatch);
router.delete('/batch/:batchId',StudentService.exitBatch);
router.put('/edit',StudentService.updateProfile);

module.exports = router;