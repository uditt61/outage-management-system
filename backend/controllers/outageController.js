const Outage = require('../models/Outage');
const Notification = require('../models/Notification');
const { Admin } = require('../models/User');

exports.getAllOutages = async (req, res) => {
  try {
    const outages = await Outage.find().sort({ createdAt: -1 });
    res.json(outages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching outages' });
  }
};

exports.createOutage = async (req, res) => {
  try {
    const newOutage = new Outage(req.body);
    await newOutage.save();
    
    await Notification.create({
      userId: newOutage.reportedBy,
      message: `Your outage report '${newOutage.title}' has been successfully received.`
    });

    // Notify Admin(s) about the new report
    const admins = await Admin.find();
    const adminNotifications = admins.map(admin => ({
      userId: admin._id.toString(),
      message: `New Outage Report: '${newOutage.title}' has been submitted and is pending review.`
    }));
    
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }

    res.status(201).json(newOutage);
  } catch (err) {
    res.status(500).json({ message: 'Error creating outage' });
  }
};

exports.getUserOutages = async (req, res) => {
  try {
    const outages = await Outage.find({ reportedBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(outages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user outages' });
  }
};

exports.getAssignedOutages = async (req, res) => {
  try {
    const outages = await Outage.find({ assignedTo: req.params.userId }).sort({ createdAt: -1 });
    res.json(outages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned outages' });
  }
};

exports.updateOutage = async (req, res) => {
  try {
    const oldOutage = await Outage.findById(req.params.id);
    const outage = await Outage.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (req.body.status && req.body.status !== oldOutage.status) {
      await Notification.create({ userId: outage.reportedBy, message: `The status of your outage report '${outage.title}' has been updated to: ${req.body.status.replace('_', ' ')}.` });

      if (req.body.status === 'resolved') {
        const admins = await Admin.find();
        const adminNotifications = admins.map(admin => ({
          userId: admin._id.toString(),
          message: `Outage Report '${outage.title}' has been marked as resolved.`
        }));
        if (adminNotifications.length > 0) {
          await Notification.insertMany(adminNotifications);
        }
      }
    }

    if (req.body.assignedTo && req.body.assignedTo !== oldOutage.assignedTo) {
      await Notification.create({ userId: req.body.assignedTo, message: `You have been assigned to a new outage: '${outage.title}'.` });
      await Notification.create({ userId: outage.reportedBy, message: `A technician (${req.body.assignedToName}) has been assigned to your outage report '${outage.title}'.` });
    }

    res.json(outage);
  } catch (err) {
    res.status(500).json({ message: 'Error updating outage' });
  }
};