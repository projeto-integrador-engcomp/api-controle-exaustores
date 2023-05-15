const bcrypt = require('bcrypt');

// Models
const User = require('../models/User');

const createUserController = {
  store: async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;

    if (!name) {
      return response.status(422).json({ msg: 'O nome é obrigatório.' });
    }

    if (!email) {
      return response.status(422).json({ msg: 'O email é obrigatório.' });
    }

    if (!password) {
      return response.status(422).json({ msg: 'A senha é obrigatória.' });
    }

    if (password != confirmPassword) {
      return response.status(422).json({ msg: 'As senhas não correspondem.' });
    }

    // verificar se o usuário existe
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return response.status(422).json({ msg: 'Por favor, utilize outro email.' });
    }

    // criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // criar usuário
    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    try {
      await user.save();
      response.status(201).json({ msg: 'Usuário criado com sucesso!' });

    } catch (error) {
      console.log(error);
      response.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
  }
}

module.exports = createUserController;