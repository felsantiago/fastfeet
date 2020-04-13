import StatusService from '../services/StatusService';

const ERRO_INESPERADO = 'Erro inesperado.';

class StatusController {
  async index(req, res) {
    try {
      const { id } = req.params;

      const { page = 1, delivered = false } = req.query;

      const {
        deliveries,
        deliverymanExists,
        count,
      } = await StatusService.index(id, page, delivered);

      return res.json({ deliveries, deliveryman: deliverymanExists, count });
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async update(req, res) {
    try {
      const { id, deliveryId } = req.params;

      const updatedDelivery = await StatusService.update({
        id,
        deliveryId,
        data: req.body,
      });

      return res.json(updatedDelivery);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new StatusController();
