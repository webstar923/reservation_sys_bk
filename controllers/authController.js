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
      return res.status(400).json({ message: 'ユーザーは既に存在します' });
    }
    
    if (!name || !phoneNum || !email || !password || !address) {
      return res.status(400).json({ message: '必須項目はすべて入力してください' });
    }
    
    const newUser = await User.create({ name, password, phoneNum,email,address});

    res.status(201).json({ message: 'ユーザーが正常に作成されました' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーr' });
  }
};

// Login user and generate a JWT token
const login = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'ユーザーが見つかりません' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '無効な資格情報' });
    }

    const accessToken  = jwt.sign({ id: user.id, username: user.name, role: user.role }, JWT_SECRET,{expiresIn:'10h'});
    const refreshToken  = jwt.sign({ id: user.id, username: user.name, role: user.role }, JWT_REFRESH_SECRET,{expiresIn:'10h'});
    
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
    
    res.json({ message: 'ログインに成功しました', accessToken ,refreshToken,role:user.role });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーr' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'ユーザーが見つかりません' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;  

    await user.save();  

    res.json({ message: 'パスワードのリセットに成功しました!' });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーr' });
  }
};


// Login user and generate a JWT token
const logout = async (req, res) => {
  try {
    // Clear the cookies by setting them with max-age = 0
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/', // Ensures the cookie is deleted from the root domain
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.json({ message: 'ログアウトに成功しました' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};



module.exports = { register, login, resetPassword, logout };
