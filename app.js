const express = require('express');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const flatRoutes = require('./routes/flatRoutes');
const workRoutes = require('./routes/workRoutes');
const userRoutes = require('./routes/userRoutes');
const authenticate = require('./middleware/authMiddleware');





const app = express();
// app.use(cookieParser());
// Middleware to parse JSON
app.use(express.json());

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/reservation',authenticate,reservationRoutes);
app.use('/api/flat',authenticate,flatRoutes)
app.use('/api/work',authenticate,workRoutes)
app.use('/api/user',authenticate,userRoutes)




// Sync Sequelize models and start the server
sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
