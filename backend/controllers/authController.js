const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Input Validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Name can only contain letters and spaces.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special symbol.' });
    }

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
    console.error("Registration Error:", err);
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
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let account = await Admin.findOne({ email }) || await User.findOne({ email });

    if (!account) {
      // Create a new user if one doesn't exist
      const requestedRole = role || 'customer';
      
      if (requestedRole === 'admin') {
        const adminExists = await Admin.findOne();
        if (adminExists) {
          return res.status(403).json({ message: 'An admin account already exists. Only one admin is allowed.' });
        }
        account = new Admin({ name, email, password: sub }); // using sub as a placeholder password
        await account.save();
      } else {
        account = new User({ name, email, password: sub, role: requestedRole });
        await account.save();
      }
    }

    const jwtToken = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
};