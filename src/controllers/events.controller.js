const prisma = require('../config/prismaClient');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        title: title,
        description: description,
        date: new Date(date), // Convert string date to Date object
        createdById: parseInt(createdBy), // Link to the user who created it
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
};

module.exports = {
  createEvent,
};