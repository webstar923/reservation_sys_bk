const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const JWT_SECRET = 'your_secret_key'; // Store in an environment variable for production
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';

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

    const accessToken  = jwt.sign({ id: user.id, username: user.name, role: user.role }, JWT_SECRET,{expiresIn:'1h'});
    const refreshToken  = jwt.sign({ id: user.id, username: user.name, role: user.role }, JWT_REFRESH_SECRET,{expiresIn:'1h'});
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ message: 'Login successful', accessToken ,refreshToken,role:user.role });
  
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
