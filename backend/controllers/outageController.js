const Outage = require('../models/Outage');
const Notification = require('../models/Notification');
const { Admin, User } = require('../models/User');
const { sendEmail } = require('../models/emailService');

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
      
      // Send email to admins
      const adminEmails = admins.map(admin => admin.email);
      if (adminEmails.length > 0) {
        await sendEmail(
          adminEmails.join(','),
          'New Outage Report Submitted',
          `A new outage report titled '${newOutage.title}' has been submitted by ${newOutage.reportedByName} and is pending review.\n\nDescription: ${newOutage.description}\nLocation: ${newOutage.location}`
        ).catch(console.error);
      }
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
        
        // Send email to consumer
        const reporter = await User.findById(outage.reportedBy);
        if (reporter && reporter.email) {
          await sendEmail(
            reporter.email,
            'Outage Report Resolved',
            `Hello ${reporter.name},\n\nYour outage report titled '${outage.title}' has been successfully resolved.\n\nResolution Notes: ${outage.resolutionNotes || 'No additional notes provided.'}\n\nThank you for reporting.`
          ).catch(console.error);
        }
      }
    }

    if (req.body.assignedTo && req.body.assignedTo !== oldOutage.assignedTo) {
      await Notification.create({ userId: req.body.assignedTo, message: `You have been assigned to a new outage: '${outage.title}'.` });
      await Notification.create({ userId: outage.reportedBy, message: `A technician (${req.body.assignedToName}) has been assigned to your outage report '${outage.title}'.` });

      // Send email to technician
      const technician = await User.findById(req.body.assignedTo);
      if (technician && technician.email) {
        await sendEmail(
          technician.email,
          'New Outage Assignment',
          `Hello ${technician.name},\n\nYou have been assigned to a new outage report titled '${outage.title}'.\n\nDescription: ${outage.description}\nLocation: ${outage.location}\nPriority: ${outage.priority}\n\nPlease review the dashboard for more details.`
        ).catch(console.error);
      }
    }

    res.json(outage);
  } catch (err) {
    res.status(500).json({ message: 'Error updating outage' });
  }
};