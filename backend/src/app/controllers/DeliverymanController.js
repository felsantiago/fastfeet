import DeliverymanService from '../services/DeliverymanService';

const ERRO_INESPERADO = 'Erro inesperado.';

class DeliverymanController {
  async store(req, res) {
    try {
      const { id, name, email } = await DeliverymanService.store({
        data: req.body,
      });

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

  async index(req, res) {
    try {
      const { page, name } = req.query;

      const { deliveryman, count } = await DeliverymanService.index(name, page);

      res.header('X-Total-Count', count);

      return res.json(deliveryman);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const updatedDeliveryman = await DeliverymanService.update({
        id,
        data: req.body,
      });

      return res.json(updatedDeliveryman);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await DeliverymanService.delete(id);

      return res.status(204).send();
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new DeliverymanController();
