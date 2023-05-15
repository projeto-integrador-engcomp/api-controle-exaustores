const routes = require('express').Router();

// Middleware
const checkToken = require('../middleware/auth');

// Controllers
const createUserController = require('../controllers/createUserController');
const authUserController = require('../controllers/authUserController');

// Public Route
routes.get('/', (_request, response) => {
  response.status(200).json({ msg: 'Endpoint inicial da API.' });
});

// Register User
routes.post('/register', createUserController.store);

// Login User
routes.post('/login', authUserController.store);

module.exports = routes;