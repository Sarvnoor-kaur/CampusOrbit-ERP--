const Exam = require('../models/Exam');
const Marksheet = require('../models/Marksheet');

const createExam = async (req, res) => {
  try {
    const { examName, examType, subject, batch, date, totalMarks, passingMarks } = req.body;

    if (!examName || !examType || !subject || !batch || !totalMarks) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const exam = new Exam({
      examName,
      examType,
      subject,
      batch,
      date,
      totalMarks,
      passingMarks,
      createdBy: req.user.id,
    });

    await exam.save();
    await exam.populate('subject', 'subjectName');

    res.status(201).json({ success: true, message: 'Exam created', exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const batch = req.query.batch || '';
    const examType = req.query.examType || '';

    const query = {};
    if (batch) query.batch = batch;
    if (examType) query.examType = examType;

    const exams = await Exam.find(query)
      .populate('subject', 'subjectName')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Exam.countDocuments(query);

    res.status(200).json({
      success: true,
      exams,
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

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id).populate('subject', 'subjectName');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exam = await Exam.findByIdAndUpdate(id, updateData, { new: true }).populate('subject', 'subjectName');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, message: 'Exam updated', exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const publishResults = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const marksheets = await Marksheet.updateMany(
      { exam: examId },
      { isPublished: true },
      { new: true }
    );

    exam.isPublished = true;
    await exam.save();

    res.status(200).json({
      success: true,
      message: 'Results published',
      exam,
      publishedCount: marksheets.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const marksheets = await Marksheet.find({ exam: examId })
      .populate('student', 'personalDetails admissionNumber')
      .populate('subject', 'subjectName')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Marksheet.countDocuments({ exam: examId });

    const exam = await Exam.findById(examId);

    res.status(200).json({
      success: true,
      exam,
      results: marksheets,
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

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  publishResults,
  getExamResults,
};
