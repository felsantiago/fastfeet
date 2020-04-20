import DeliveryService from '../services/DeliveryService';

const ERRO_INESPERADO = 'Erro inesperado.';

class DeliveryController {
  async store(req, res) {
    try {
      const delivery = await DeliveryService.store({ data: req.body });

      return res.json(delivery);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryService.show(id);
      return res.json(delivery);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async index(req, res) {
    try {
      const { page, name } = req.query;

      const { deliveries, count } = await DeliveryService.index(name, page);

      res.header('X-Total-Count', count);

      return res.json(deliveries);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const updatedDelivery = await DeliveryService.update({
        id,
        data: req.body,
      });

      return res.json(updatedDelivery);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await DeliveryService.delete(id);

      return res.status(204).send();
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new DeliveryController();
