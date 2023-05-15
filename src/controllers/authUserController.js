require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');

const authUserController = {
  store: async (request, response) => {
    const { email, password } = request.body;

    if (!email) {
      return response.status(422).json({ msg: 'O email é obrigatório.' });
    }

    if (!password) {
      return response.status(422).json({ msg: 'A senha é obrigatória.' });
    }

    // verificar se o usuário existe
    const user = await User.findOne({ email: email });
    if (!user) {
      return response.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    // checar a senha do usuário
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return response.status(422).json({ msg: 'Senha inválida.' });
    }

    try {
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign(
        {
          id: user._id
        },
        secret
      );

      response.status(200).json({ msg: 'Autenticação realizada com sucesso', token });

    } catch (error) {
      console.log(error);
      response.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
  }
}

module.exports = authUserController;