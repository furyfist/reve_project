const prisma = require('../config/prismaClient');
const { triggerNotification } = require('./notification.service');

/**
 * Checks the RSVP count for an event and triggers a notification if it hits 10.
 * @param {number} eventId - The ID of the event to check
 */
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

    // --- Core Business Logic ---
    if (rsvpCount === 10) {
      triggerNotification(
        `Event "${event.title}" (ID: ${event.id}) has just reached 10 RSVPs!`
      );
    }
  } catch (error) {
    // We log this error but don't re-throw it.
    // A notification failure should not cause the user's RSVP request to fail.
    console.error('Error in notification service:', error);
  }
};

module.exports = {
  checkRsvpCountAndNotify,
};