import DeliveryProblemService from '../services/DeliveryProblemService';

const ERRO_INESPERADO = 'Erro inesperado.';

class DeliveryProblemController {
  async store(req, res) {
    try {
      const { id } = req.params;

      const { problem, delivery } = await DeliveryProblemService.store(
        id,
        req.body
      );

      return res.json({
        problem,
        delivery,
      });
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const problems = await DeliveryProblemService.index(page);

      return res.json(problems);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const delivery = await DeliveryProblemService(id);

      return res.json(delivery);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new DeliveryProblemController();
