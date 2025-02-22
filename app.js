const express = require('express');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const flatRoutes = require('./routes/flatRoutes');
const workRoutes = require('./routes/workRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const authenticate = require('./middleware/authMiddleware');

const app = express();
 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservation',authenticate,reservationRoutes);
app.use('/api/flat',authenticate,flatRoutes);
app.use('/api/work',authenticate,workRoutes);
app.use('/api/user',authenticate,userRoutes);
app.use('/api/log',authenticate,logRoutes);

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
