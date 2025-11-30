const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register-student', authController.registerStudent);
router.post('/login-student', authController.loginStudent);
router.post('/login-teacher', authController.loginTeacher);
router.post('/login-admin', authController.loginAdmin);
router.get('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;
