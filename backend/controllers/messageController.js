const Message = require("../models/Message");
const Notice = require("../models/Notice");

const sendMessage = async (req, res) => {
  try {
    const {
      recipient,
      recipientModel,
      subject,
      message,
      messageType,
      priority,
    } = req.body;

    if (!recipient || !message || !recipientModel) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newMessage = new Message({
      sender: req.user.id,
      senderModel:
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
      recipient,
      recipientModel,
      subject,
      message,
      messageType,
      priority,
    });

    await newMessage.save();

    res
      .status(201)
      .json({ success: true, message: "Message sent", newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReceivedMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const isRead = req.query.isRead;

    const query = { recipient: req.user.id };
    if (isRead !== undefined) query.isRead = isRead === "true";

    const messages = await Message.find(query)
      .populate("sender", "personalDetails firstName lastName email")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      messages,
      unreadCount,
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

const getSentMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const messages = await Message.find({ sender: req.user.id })
      .populate("recipient", "personalDetails firstName lastName email")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments({ sender: req.user.id });

    res.status(200).json({
      success: true,
      messages,
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

const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, content, category, visibility, expiryDate } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const notice = new Notice({
      title,
      content,
      category,
      visibility,
      expiryDate,
      postedBy: req.user.id,
    });

    await notice.save();

    res.status(201).json({ success: true, message: "Notice created", notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || "";

    const query = { isActive: true };
    if (category) query.category = category;

    const notices = await Notice.find(query)
      .populate("postedBy", "firstName lastName")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ isPinned: -1, createdAt: -1 });

    const total = await Notice.countDocuments(query);

    res.status(200).json({
      success: true,
      notices,
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

const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const updateData = req.body;

    const notice = await Notice.findByIdAndUpdate(noticeId, updateData, {
      new: true,
    }).populate("postedBy", "firstName lastName");

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice updated", notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findByIdAndDelete(noticeId);

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getReceivedMessages,
  getSentMessages,
  markMessageAsRead,
  deleteMessage,
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
};
