const prisma = require('../config/prismaClient');

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

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

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

    
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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