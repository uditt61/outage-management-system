const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email is already taken in EITHER collection
    const emailTaken = (await Admin.findOne({ email })) || (await User.findOne({ email }));
    if (emailTaken) return res.status(400).json({ message: 'Email already in use' });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If registering an admin, save to the Admin collection
    if (role === 'admin') {
      const adminExists = await Admin.findOne();
      if (adminExists) {
        return res.status(403).json({ message: 'An admin account already exists. Only one admin is allowed.' });
      }
      const newAdmin = new Admin({ name, email, password: hashedPassword });
      await newAdmin.save();
      const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1d' });
      return res.status(201).json({ id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role, token });
    }

    // Otherwise, save to the regular User collection
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1d' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let account = await Admin.findOne({ email });
    if (!account) account = await User.findOne({ email });
    if (!account) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1d' });
    res.json({ id: account._id, name: account.name, email: account.email, role: account.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};