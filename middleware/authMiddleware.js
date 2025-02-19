const jwt = require('jwt-simple');
const JWT_SECRET = 'your_secret_key'; // Use an environment variable in production

// Middleware to authenticate user based on JWT token
const authenticate = (req, res, next) => {
  
  const token = req.headers;
  console.log("123687:",token);
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }
 
  
  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
