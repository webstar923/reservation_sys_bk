const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const User = require('../models/User');



const getUserAllData = async (req, res) => {  
  try {  
    const userData = await User.findAll();    
    const dataValues = userData.map(user => user.dataValues);
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
const changeUser = async (req, res) => {
  try {
    const {id,name,email,phoneNum,address,role} = req.body; // Extract name from the request body   
    console.log("this is backend data:",start_time);
    
    if (!id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const User = await User.findByPk(id);
    console.log(User);
    
    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }
    
        User.name = name; 
        User.email = email; 
        User.phoneNum = phoneNum; 
        User.address = address; 
        User.role = role; 
    
    await User.save();
    return res.status(200).json(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const createUser = async (req, res) => {  
 
  try {
    const { name,password,email,phoneNum,address,role} = req.body;

    if ( !name||!email||!password||!phoneNum||!address||!role) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    const newUser = await User.create({ name,password,email,phoneNum,address,role});
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
   
    if (!id) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const UserToDelete = await User.findOne({ where: { id } });
    if (!UserToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.destroy({ where: { id } });
    res.status(200).json({ message: 'Flat deleted successfully', User: UserToDelete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
    getUserAllData, changeUser, createUser, deleteUser
  };
