import NotificationService from '../services/NotificationService';

const ERRO_INESPERADO = 'Erro inesperado.';

class NotificationController {
  async index(req, res) {
    try {
      const id = req.userId;
      const notifications = await NotificationService.index(id);

      return res.json(notifications);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.update(id);

      return res.json(notification);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new NotificationController();
