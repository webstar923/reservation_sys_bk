const mysql = require('mysql2');
const Log = require('./models/Log');

// Set up MySQL connection
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reservation_system'
});


const insertLog = async(level, message)=> {
    const logo = await Log.create({ level, message});
}

function logError(message) {
  insertLog('error', message);
}

function logInfo(message) {
  insertLog('info', message);
}
function logInportantInfo(message) {
  insertLog('inportant', message);
}
function logChangeInfo(message) {
  insertLog('change', message);
}
module.exports = {
  logError,
  logInfo,
  logInportantInfo,
  logChangeInfo,
};
