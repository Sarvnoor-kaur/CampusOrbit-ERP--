const mongoose = require('mongoose');

const lmsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['study_material', 'assignment', 'quiz', 'video'],
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    subjectName: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    batch: String,
    semester: Number,
    fileUrl: String,
    fileSize: Number,
    duration: Number,
    dueDate: Date,
    totalMarks: Number,
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        submissionDate: Date,
        fileUrl: String,
        marksObtained: Number,
        feedback: String,
        status: {
          type: String,
          enum: ['submitted', 'pending', 'graded'],
        },
      },
    ],
    quizQuestions: [
      {
        questionNumber: Number,
        questionText: String,
        questionType: {
          type: String,
          enum: ['mcq', 'short_answer', 'essay'],
        },
        options: [String],
        correctAnswer: String,
        marks: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LMS', lmsSchema);
