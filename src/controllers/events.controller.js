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

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
      // 'include' is how we fetch related data
      include: {
        // 1. Get the count of rsvps
        _count: {
          select: { rsvps: true },
        },
        // 2. Get the list of Rsvp join-table records
        rsvps: {
          // 3. For each Rsvp record, include the related User
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 1. We want a simple list of users, not the complex Rsvp objects
    const userList = event.rsvps.map((rsvp) => rsvp.user);
    // 2. We want a simple 'rsvpCount' number, not the nested '_count' object
    const rsvpCount = event._count.rsvps;

    // Build the final response object
    const response = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      createdById: event.createdById,
      rsvpCount: rsvpCount,
      users: userList, // This is the "user list" from the brief
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    // Create an object for the data to be updated
    // This allows for partial updates (e.g., only sending a title)
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date); // Convert string to Date

    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    // Prisma-specific error for when a record is not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Required to check ownership

    // To test this endpoint, you must pass a 'userId' in the request body
    if (!userId) {
      return res
        .status(400)
        .json({ error: 'userId is required in the body to verify ownership' });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // --- Business Logic Check ---
    // Fulfills the requirement: "only by creator"
    if (event.createdById !== parseInt(userId)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You are not the creator of this event' });
    }

    // If check passes, proceed with deletion
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    // 204 No Content is the standard response for a successful DELETE
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent, 
  deleteEvent,
};