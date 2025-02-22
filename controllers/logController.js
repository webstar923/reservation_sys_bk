const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const Log = require('../models/Log');

const getErrorData = async (req, res) => {  
  try {  
    const ErrorData = await Log.findAll({
        where: {
          level: 'error'
        },
        attributes: ['id', 'level', 'message', 'timestamp'],
      });    


    const dataValues = ErrorData.map(error => error.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    console.log(dataValues);
    
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getChangeData = async (req, res) => {  
  try {  
    const ChangeData = await Log.findAll({
        where: {
          level: 'change'
        },
        attributes: ['id', 'level', 'message', 'timestamp'],
      });    


    const dataValues = ChangeData.map(data => data.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    console.log(dataValues);
    
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { 
    getErrorData,getChangeData
  };
