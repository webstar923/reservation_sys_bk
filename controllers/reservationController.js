const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const Flat = require('../models/Flat'); // Your Flat model
const Work = require('../models/Work');
const Reservation = require('../models/Reservation');

// Find Flat by partial match on the name
const findFlat = async (req, res) => {
  try {
    const { name } = req.body; // Extract name from the request body
    console.log('Received name:', name);

    // If no name is provided, return a 400 error
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const flats = await Flat.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` // Partial match with wildcards
        }
      }
    });

    if (flats.length === 0) {
      return res.status(404).json({ message: 'No flats found with that name' });
    }
    const dataValues = flats.map(flat => flat.dataValues);
    return res.status(200).json({dataValues}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findReservation = async (req, res) => {
  try {
    const { reservation_id } = req.body; // Extract name from the request body   

    // If no name is provided, return a 400 error
    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const reservations = await Reservation.findAll({
      where: {id: reservation_id }
    });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found with that id' });
    }
    const dataValues = reservations.map(reservation => reservation.dataValues);
    return res.status(200).json({dataValues}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findChangeDate = async (req, res) => {
  try {
    const { reservation_id } = req.body; // Extract name from the request body   
    // If no name is provided, return a 400 error
    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const reservations = await Reservation.findOne({
      where: {id: reservation_id }
    });

    
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found with that id' });
    }   
    const { room_num, work_name, flat_name } = reservations.dataValues;
    const whereConditions = {
      flat_name: flat_name,
      work_name: work_name,
      room_num : room_num
    };     
    
    const works = await Work.findAll({
      where: whereConditions,
    });

    if (works.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }
    const allDates = works.flatMap(work =>
      __getDatesBetween(work.start_time, work.end_time)
    );
    const bookedReservations = await Reservation.findAll({
      where: whereConditions,
    });
    const reservedDates = bookedReservations.flatMap(reservation => 
     reservation.dataValues.reservation_time.toISOString().split('T')[0]
    );
    const availableDates = allDates.filter(date => {
      return !reservedDates.includes(date);
    });
    return res.status(200).json({availableDates}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const updatReservation = async (req, res) => {
  try {
    const { reservation_id,reservation_date,reservation_division} = req.body; // Extract name from the request body   
    
    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    reservation.reservation_time = reservation_date; 
    reservation.division = reservation_division || reservation.division; 
    await reservation.save();

    return res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findWork = async (req, res) => {
  try {
    const { room_num, flat_name } = req.body;

    if (!room_num) {
      return res.status(400).json({ message: 'room_num is required' });
    }

    if (!flat_name) {
      return res.status(400).json({ message: 'flat_name is required' });
    }

    // Get the current time in the same format as the database (i.e., TIME type)
    const currentTime = new Date();
    
    // Set the where condition for Sequelize query
    const whereConditions = {
      flat_name: flat_name,
      room_num: room_num,
      start_time: {
        [Op.lte]: currentTime,  // Current time must be greater than or equal to start_time
      },
      end_time: {
        [Op.gte]: currentTime,  // Current time must be less than or equal to end_time
      },
    };

    // Query works using Sequelize
    const works = await Work.findAll({
      where: whereConditions,
    });

    // Check if no works are found
    if (works.length === 0) {
      return res.status(404).json({ message: 'No works found during the current time' });
    }

    // Return found works
    return res.status(200).json(works);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getChangeableDate = async (req, res) => {
  try {
    const {work_name,flat_name,room_num} = req.body; // Extract name from the request body   
    
    const whereConditions = {
      flat_name: flat_name,
      work_name: work_name,
      room_num : room_num,
    };
    
    const works = await Work.findAll({
      where: whereConditions,
    });

    if (works.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }
    const allDates = works.flatMap(work =>
      __getDatesBetween(work.start_time, work.end_time)
    );
    const bookedReservations = await Reservation.findAll({
      where: whereConditions,
    });
    const reservedDates = bookedReservations.flatMap(reservation => 
     reservation.dataValues.reservation_time.toISOString().split('T')[0]
    );
    const availableDates = allDates.filter(date => {
      return !reservedDates.includes(date);
    });
    return res.status(200).json({availableDates}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

function __getDatesBetween(startTime, endTime) {
  const dates = [];
  let currentDate = new Date(); // Start from startTime  
  const end = new Date(endTime);
  while (currentDate.toISOString().split('T')[0] <= end.toISOString().split('T')[0]) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
const createReservation = async (req, res) => {  
  try {
    const { flat_name,room_num,work_name,reservation_time,division} = req.body;
    
    if (!flat_name || !room_num || !work_name || !reservation_time || !division) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    const newReservation = await Reservation.create({user_name:4, flat_name,room_num,work_name,reservation_time,division});
    console.log(newReservation);
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getReservations = async (req, res) => {  
  try {  
      
    const bookedReservations = await Reservation.findAll({user_name:4});    
    
    const dataValues = bookedReservations.map(reservation => {
      // reservation_time を年月日のみの形式に変換
      const reservationTime = new Date(reservation.dataValues.reservation_time);
      const formattedDate = reservationTime.toISOString().split('T')[0]; // 'YYYY-MM-DD' 形式に変換
    
      return {
        ...reservation.dataValues,
        reservation_time: formattedDate, // 変更した年月日を設定
      };
    }); 
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    res.status(201).json(dataValues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  findFlat, findWork, findReservation, findChangeDate, updatReservation,
  getChangeableDate, createReservation, getReservations };
