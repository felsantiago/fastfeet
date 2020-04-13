import RecipientService from '../services/RecipientService';

const ERRO_INESPERADO = 'Erro inesperado.';

class RecipientController {
  async store(req, res) {
    try {
      const { name, zip_code } = req.body;

      const {
        id,
        address_details,
        number: addressNumber,
        state,
        city,
      } = await RecipientService.store({ data: req.body });

      return res.json({
        id,
        name,
        addressNumber,
        address_details,
        state,
        city,
        zip_code,
      });
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async index(req, res) {
    try {
      const { page, name } = req.query;
      const { recipients, count } = await RecipientService.index(name, page);

      res.header('X-Total-Count', count);

      return res.json(recipients);
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const {
        number: addressNumber,
        street,
        address_details,
        state,
        city,
        zip_code,
      } = await RecipientService.update({ id, data: req.body });

      return res.json({
        name,
        addressNumber,
        street,
        address_details,
        state,
        city,
        zip_code,
      });
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await RecipientService.delete(id);

      return res.status(204).send();
    } catch (err) {
      if (err.erro) return res.status(err.code).json(err);

      return res.status(500).json({ erro: ERRO_INESPERADO });
    }
  }
}

export default new RecipientController();
