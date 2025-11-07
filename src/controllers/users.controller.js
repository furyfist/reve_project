const prisma = require('../config/prismaClient');

// Controller function for POST /users
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // We use Prisma Client to create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    // Send back the new user data with a 201 (Created) status
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Controller function for GET /users
const getAllUsers = async (req, res) => {
  try {
    // We use Prisma Client to find all users
    const users = await prisma.user.findMany();

    // Send back the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};