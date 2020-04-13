import UserService from '../services/UserService';

const ERRO_INESPERADO = 'Erro inesperado.';

class UserController {
  async store(req, res) {
    try {
      const { id, name, email } = await UserService.store({ data: req.body });

      return res.json({
        id,
        name,
        email,
      });
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new UserController();
