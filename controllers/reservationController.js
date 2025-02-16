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

const findWork = async (req, res) => {
  try {
    const { flat_name } = req.body; // Extract name from the request body
    // If no name is provided, return a 400 error
    if (!flat_name) {
      return res.status(400).json({ message: 'selectedwork is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const works = await Work.findAll({
      where: {flat_name: flat_name }
    });
    if (works.length === 0) {
      return res.status(404).json({ message: 'No wroks found with that name' });
    }
    const dataValues = works.map(work => work.dataValues);
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
    };
    
    // Conditionally add room_num to the where clause if it exists
    if (room_num) {
      whereConditions.room_num = room_num;
    }
    
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
      __getDatesBetween(reservation.dataValues.reservation_time, reservation.dataValues.reservation_time)
    );
    const availableDates = allDates.filter(date => !reservedDates.includes(date));
    console.log(availableDates);
    
    return res.status(200).json({availableDates}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
function __getDatesBetween(startTime, endTime) {
  const dates = [];
  let currentDate = new Date(startTime);

  while (currentDate <= new Date(endTime)) {
    // Push each date in YYYY-MM-DD format
    dates.push(new Date(currentDate).toISOString().split('T')[0]);
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
module.exports = { findFlat, findWork, findReservation, findChangeDate };
