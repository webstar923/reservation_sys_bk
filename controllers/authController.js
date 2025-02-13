const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const JWT_SECRET = 'your_secret_key'; // Store in an environment variable for production

// Register a new user
const register = async (req, res) => {
  try {
    const { name, phoneNum, email, password, address } = req.body;
    const existingUser = await User.findOne({ where: { email } });    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    if (!name || !phoneNum || !email || !password || !address) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    const newUser = await User.create({ name, password, phoneNum,email,address});

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user and generate a JWT token
const login = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.name, role: user.role }, JWT_SECRET,{expiresIn:'1h'});
    
    res.cookie('suthToken',token,{
      httpOnly: true, // Prevents access via JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'Strict', // CSRF protection
      maxAge: 3600000, // 1 hour
    });
    
    res.json({ message: 'Login successful', token,role:user.role });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile (protected route)
const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, profile };
