const express = require('express');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');


const app = express();
// app.use(cookieParser());
// Middleware to parse JSON
app.use(express.json());

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/reservation',reservationRoutes);


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
