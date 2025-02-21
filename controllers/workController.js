const { Op } = require('sequelize'); 
const Work = require('../models/Work');



const getWorkAllData = async (req, res) => {  
  try {  
    const workData = await Work.findAll();    
    const dataValues = workData.map(work => work.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const changeWork = async (req, res) => {
  try {
    const {id, work_name, flat_name, room_num, start_time, end_time} = req.body; // Extract name from the request body   
    console.log("this is backend data:",start_time);
    
    if (!id) {
      return res.status(400).json({ message: 'work_id is required' });
    }

    const Work = await Work.findByPk(id);
    if (!Work) {
      return res.status(404).json({ message: 'Work not found' });
    }
        Work.work_name= work_name; 
        Work.flat_name= flat_name; 
        Work.room_num= room_num; 
        Work.start_time= start_time; 
        Work.end_time= end_time; 
    
    await Work.save();
    return res.status(200).json(Work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const createWork = async (req, res) => {  
 
  try {
    const { work_name,flat_name, room_num, start_time, end_time} = req.body;
    console.log("asdfsd",work_name,flat_name, room_num, start_time, end_time);
    if ( !work_name||!flat_name||!room_num||!start_time||!end_time) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    const newWork = await Work.create({work_name,flat_name, room_num, start_time, end_time});
    console.log(newWork);
    res.status(201).json(newWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteWork = async (req, res) => {
  try {
    const { id } = req.body;
   
    if (!id) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const WorkToDelete = await Work.findOne({ where: { id } });
    if (!WorkToDelete) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    await Work.destroy({ where: { id } });
    res.status(200).json({ message: 'Flat deleted successfully', Work: WorkToDelete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
    getWorkAllData, changeWork, createWork, deleteWork
  };
