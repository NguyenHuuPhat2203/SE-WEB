const userRepository = require("../repositories/userRepositoryMongo");

// GET /api/notifications (protected - uses req.user from auth middleware)
exports.list = async (req, res) => {
  try {
    const bknetId = req.user.bknetId; // From JWT token
    const notifications = await userRepository.getNotifications(bknetId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/addnotification (protected)
// body: { receiverBknetId, title, content, type }
exports.create = async (req, res) => {
  try {
    const { receiverBknetId, title, content, type } = req.body;
    const senderBknetId = req.user.bknetId; // From JWT token

    const noti = await userRepository.addNotification(receiverBknetId, {
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

// PATCH /api/notifications/:id/read (protected)
exports.markRead = async (req, res) => {
  try {
    const bknetId = req.user.bknetId; // From JWT token
    const notificationId = req.params.id; // MongoDB ObjectId

    await userRepository.markNotificationRead(bknetId, notificationId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/notifications/unread-count (protected)
exports.unreadCount = async (req, res) => {
  try {
    const bknetId = req.user.bknetId; // From JWT token
    const notifications = await userRepository.getNotifications(bknetId);
    const count = notifications.filter((n) => n.unread).length;

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
