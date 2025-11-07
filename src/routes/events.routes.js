const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events.controller');

router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.patch('/events/:id', eventController.patchEvent); 
router.delete('/events/:id', eventController.deleteEvent);
router.post('/events/:id/rsvp', eventController.rsvpToEvent);
router.delete('/events/:id/rsvp', eventController.removeRsvp);
router.get('/events/:id/rsvps', eventController.getRsvpsForEvent);

module.exports = router;