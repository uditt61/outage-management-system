const { User } = require('../models/User');

exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select('-password');
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching technicians' });
  }
};