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

const getUserById = async (req, res) => {
  try {
    // Get the 'id' from the URL parameters
    const { id } = req.params;

    // Find the user by their unique ID
    // We use parseInt() because req.params.id is a string
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // If no user is found, return a 404 (Not Found)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is found, send back their data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};