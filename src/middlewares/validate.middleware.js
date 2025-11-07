const Joi = require('joi');

/**
 * A middleware that validates req.body against a Joi schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    // If validation fails, send a 400 Bad Request
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validate;