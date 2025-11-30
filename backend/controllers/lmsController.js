const LMS = require('../models/LMS');

const uploadContent = async (req, res) => {
  try {
    const { title, description, type, subject, batch, semester, dueDate, totalMarks } = req.body;

    if (!title || !type || !subject) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const lmsContent = new LMS({
      title,
      description,
      type,
      subject,
      uploadedBy: req.user.id,
      batch,
      semester,
      dueDate,
      totalMarks,
    });

    if (req.file) {
      lmsContent.fileUrl = `/uploads/${req.file.filename}`;
      lmsContent.fileSize = req.file.size;
    }

    await lmsContent.save();
    await lmsContent.populate('subject', 'subjectName');

    res.status(201).json({ success: true, message: 'Content uploaded', lmsContent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllContent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || '';
    const subject = req.query.subject || '';

    const query = { isActive: true };
    if (type) query.type = type;
    if (subject) query.subject = subject;

    const content = await LMS.find(query)
      .populate('subject', 'subjectName')
      .populate('uploadedBy', 'personalDetails')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await LMS.countDocuments(query);

    res.status(200).json({
      success: true,
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await LMS.findById(contentId)
      .populate('subject', 'subjectName')
      .populate('uploadedBy', 'personalDetails');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { contentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const content = await LMS.findById(contentId);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = {
      student: req.user.id,
      submissionDate: new Date(),
      fileUrl: `/uploads/${req.file.filename}`,
      status: 'submitted',
    };

    const existingSubmission = content.submissions.findIndex((s) => s.student.toString() === req.user.id);

    if (existingSubmission >= 0) {
      content.submissions[existingSubmission] = { ...content.submissions[existingSubmission], ...submission };
    } else {
      content.submissions.push(submission);
    }

    await content.save();

    res.status(200).json({ success: true, message: 'Assignment submitted', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const gradeAssignment = async (req, res) => {
  try {
    const { contentId, studentId } = req.params;
    const { marksObtained, feedback } = req.body;

    const content = await LMS.findById(contentId);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = content.submissions.find((s) => s.student.toString() === studentId);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.status = 'graded';

    await content.save();

    res.status(200).json({ success: true, message: 'Assignment graded', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitQuizAnswer = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'No answers provided' });
    }

    const content = await LMS.findById(contentId);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let marksObtained = 0;

    answers.forEach((answer) => {
      const question = content.quizQuestions.find((q) => q.questionNumber === answer.questionNumber);

      if (question && question.correctAnswer === answer.answer) {
        marksObtained += question.marks;
      }
    });

    const submission = {
      student: req.user.id,
      submissionDate: new Date(),
      marksObtained,
      status: 'graded',
    };

    const existingSubmission = content.submissions.findIndex((s) => s.student.toString() === req.user.id);

    if (existingSubmission >= 0) {
      content.submissions[existingSubmission] = submission;
    } else {
      content.submissions.push(submission);
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted',
      result: {
        marksObtained,
        totalMarks: content.quizQuestions.reduce((sum, q) => sum + q.marks, 0),
        percentage: ((marksObtained / content.quizQuestions.reduce((sum, q) => sum + q.marks, 0)) * 100).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { contentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const content = await LMS.findById(contentId);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const submissions = content.submissions.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      submissions,
      pagination: {
        page,
        limit,
        total: content.submissions.length,
        pages: Math.ceil(content.submissions.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const updateData = req.body;

    const content = await LMS.findByIdAndUpdate(contentId, updateData, { new: true })
      .populate('subject', 'subjectName')
      .populate('uploadedBy', 'personalDetails');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, message: 'Content updated', content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await LMS.findByIdAndDelete(contentId);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadContent,
  getAllContent,
  getContentById,
  submitAssignment,
  gradeAssignment,
  submitQuizAnswer,
  getSubmissions,
  updateContent,
  deleteContent,
};
