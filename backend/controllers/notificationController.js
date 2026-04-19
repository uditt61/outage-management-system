const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
};