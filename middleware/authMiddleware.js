const jwt = require('jwt-simple');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable for production

// Middleware to authenticate user based on JWT token
const authenticate = (req, res, next) => {
  
  
  const authHeader = req.headers['authorization']; // Get Authorization header
  
  let token = null;
  
  if (authHeader && authHeader.startsWith("Bearer")) {
    
    token = authHeader.substring(6).trim(); 
    
  }
  
 
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  try {
    // Use jwt.verify() to validate and decode the token
    const decoded = jwt.decode(token, JWT_SECRET); // jwt.verify(token, JWT_SECRET) is preferred
    req.user = decoded;    
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = authenticate;
