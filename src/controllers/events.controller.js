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

/**
 * @route GET /api/events
 * @desc Get all events with optional filters
 * @query upcoming (boolean) - Filter for events with a date >= today
 * @query limit (number) - Limit the number of results
 * @query offset (number) - Skip a number of results (for pagination)
 */
const getAllEvents = async (req, res) => {
  try {
    const { upcoming, limit, offset } = req.query;

    const prismaOptions = {
      where: {},
    };

    // 1. Filter: Handle 'upcoming' query parameter
    // We only filter if 'upcoming' is explicitly set to 'true'
    if (upcoming === 'true') {
      prismaOptions.where.date = {
        gte: new Date(), // 'gte' means "greater than or equal to"
      };
    }

    // 2. Pagination: Handle 'limit'
    if (limit) {
      prismaOptions.take = parseInt(limit);
    }

    // 3. Pagination: Handle 'offset'
    if (offset) {
      prismaOptions.skip = parseInt(offset);
    }

    const events = await prisma.event.findMany(prismaOptions);

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
};