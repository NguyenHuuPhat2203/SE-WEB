const userRepository = require('../repositories/userRepository');

// GET /api/notifications?bknetId=student
exports.list = (req, res) => {
  const bknetId = req.query.bknetId;
  try {
    const notifications = userRepository.getNotificationsByBknetId(bknetId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// POST /api/notifications
// body: { receiverBknetId, senderBknetId, title, content, type }
exports.create = (req, res) => {
  const { receiverBknetId, senderBknetId, title, content, type } = req.body;
  try {
    const noti = userRepository.addNotificationByBknetId(receiverBknetId, {
      title,
      content,
      type,
      senderBknetId,
    });
    res.status(201).json({ success: true, data: noti });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/notifications/:id/read
// body: { bknetId }
exports.markRead = (req, res) => {
  const { bknetId } = req.body;
  const notiId = Number(req.params.id);
  try {
    userRepository.markReadByBknetId(bknetId, notiId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/notifications/unread-count?bknetId=student
exports.unreadCount = (req, res) => {
  const { bknetId } = req.query;
  try {
    const count = userRepository.getUnreadCount(bknetId);
    res.json({ success: true, count });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
