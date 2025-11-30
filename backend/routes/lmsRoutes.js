const express = require('express');
const router = express.Router();
const lmsController = require('../controllers/lmsController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, roleMiddleware(['teacher']), upload.single('file'), lmsController.uploadContent);
router.get('/', authMiddleware, lmsController.getAllContent);
router.get('/:contentId', authMiddleware, lmsController.getContentById);
router.post('/:contentId/submit-assignment', authMiddleware, roleMiddleware(['student']), upload.single('file'), lmsController.submitAssignment);
router.post('/:contentId/:studentId/grade-assignment', authMiddleware, roleMiddleware(['teacher']), lmsController.gradeAssignment);
router.post('/:contentId/submit-quiz', authMiddleware, roleMiddleware(['student']), lmsController.submitQuizAnswer);
router.get('/:contentId/submissions', authMiddleware, roleMiddleware(['teacher']), lmsController.getSubmissions);
router.put('/:contentId', authMiddleware, roleMiddleware(['teacher']), lmsController.updateContent);
router.delete('/:contentId', authMiddleware, roleMiddleware(['teacher']), lmsController.deleteContent);

module.exports = router;
