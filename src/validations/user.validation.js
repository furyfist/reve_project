const Joi = require('joi');

// Joi schema for the POST /users body
const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
});

module.exports = {
  createUserSchema,
};