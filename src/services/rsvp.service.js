const prisma = require('../config/prismaClient');
const { triggerNotification } = require('./notification.service');

const checkRsvpCountAndNotify = async (eventId) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      // Use Prisma's a "relations count" for efficiency
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    const rsvpCount = event._count.rsvps;

    // Core Business Logic
    if (rsvpCount === 10) {
      triggerNotification(
        `Event "${event.title}" (ID: ${event.id}) has just reached 10 RSVPs!`
      );
    }
  } catch (error) {
    console.error('Error in notification service:', error);
  }
};

module.exports = {
  checkRsvpCountAndNotify,
};