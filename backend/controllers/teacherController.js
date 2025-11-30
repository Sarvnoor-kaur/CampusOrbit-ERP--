const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Marksheet = require('../models/Marksheet');
const Timetable = require('../models/Timetable');
const LMS = require('../models/LMS');

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).populate('subjectsAssigned').select('-password');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeacherProfile = async (req, res) => {
  try {
    const { personalDetails, department, specialization } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { personalDetails, department, specialization },
      { new: true }
    )
      .select('-password')
      .populate('subjectsAssigned');

    res.status(200).json({ success: true, message: 'Profile updated', teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { students, date, subject, batch } = req.body;

    if (!students || !date || !subject) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const attendanceRecords = students.map((student) => ({
      student: student.studentId,
      subject,
      subjectName: student.subjectName,
      teacher: req.user.id,
      batch,
      date,
      status: student.status,
      markedBy: req.user.id,
    }));

    await Attendance.insertMany(attendanceRecords);

    res.status(201).json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceBySubject = async (req, res) => {
  try {
    const { subject, batch } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { teacher: req.user.id };
    if (subject) query.subject = subject;
    if (batch) query.batch = batch;

    const attendance = await Attendance.find(query)
      .populate('student', 'personalDetails admissionNumber')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      attendance,
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

const enterMarks = async (req, res) => {
  try {
    const { student, exam, subject, marksObtained, totalMarks } = req.body;

    if (!student || !exam || !subject || marksObtained === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let marksheet = await Marksheet.findOne({ student, exam, subject });

    if (marksheet) {
      marksheet.marksObtained = marksObtained;
      await marksheet.save();
    } else {
      marksheet = new Marksheet({
        student,
        exam,
        subject,
        marksObtained,
        totalMarks,
        createdBy: req.user.id,
      });
      await marksheet.save();
    }

    res.status(200).json({ success: true, message: 'Marks entered successfully', marksheet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeacherTimetable = async (req, res) => {
  try {
    const timetables = await Timetable.findOne({ 'schedule.teacher': req.user.id });

    if (!timetables) {
      return res.status(404).json({ success: false, message: 'No timetable found' });
    }

    const teacherSchedule = timetables.schedule.filter((s) => s.teacher === req.user.id);

    res.status(200).json({ success: true, timetable: { ...timetables.toObject(), schedule: teacherSchedule } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadLMS = async (req, res) => {
  try {
    const { title, description, type, subject, batch, semester } = req.body;

    if (!req.file || !title || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields or file' });
    }

    const lms = new LMS({
      title,
      description,
      type,
      subject,
      uploadedBy: req.user.id,
      batch,
      semester,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
    });

    await lms.save();

    res.status(201).json({ success: true, message: 'LMS content uploaded', lms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      $or: [
        { 'personalDetails.firstName': { $regex: search, $options: 'i' } },
        { 'personalDetails.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ],
    };

    const teachers = await Teacher.find(query)
      .select('-password')
      .populate('subjectsAssigned')
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      teachers,
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

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).select('-password').populate('subjectsAssigned');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const teacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .populate('subjectsAssigned');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, message: 'Teacher updated', teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeacherProfile,
  updateTeacherProfile,
  markAttendance,
  getAttendanceBySubject,
  enterMarks,
  getTeacherTimetable,
  uploadLMS,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
