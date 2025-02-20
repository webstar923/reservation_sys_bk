const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const Flat = require('../models/Flat'); // Your Flat model
const Work = require('../models/Work');
const Reservation = require('../models/Reservation');

// Find Flat by partial match on the name

const getFlatAllData = async (req, res) => {  
  try {  
    const flatData = await Flat.findAll();    
    const dataValues = flatData.map(flat => flat.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const changeFlat = async (req, res) => {
  try {
    const {id,name,address} = req.body; // Extract name from the request body   
    
    if (!id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    const flat = await Flat.findByPk(id);
    if (!flat) {
      return res.status(404).json({ message: 'flat not found' });
    }
    
    flat.name = name; 
    flat.address = address; 
    await flat.save();
    return res.status(200).json(flat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const createFlat = async (req, res) => {  
  try {
    const { name,address} = req.body;
    
    if (!name || !address ) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    const newFlat = await Flat.create({name, address});
    console.log(newFlat);
    res.status(201).json(newFlat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteFlat = async (req, res) => {
  try {
    const { id } = req.body;
   
    if (!id) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const flatToDelete = await Flat.findOne({ where: { id } });
    if (!flatToDelete) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    await Flat.destroy({ where: { id } });
    res.status(200).json({ message: 'Flat deleted successfully', flat: flatToDelete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
    getFlatAllData, changeFlat, createFlat, deleteFlat
  };
