import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const { avatar_id, email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman already exists.' });
    }

    if (avatar_id) {
      const file = await File.findOne({
        where: { id: avatar_id },
      });

      if (!file) {
        return res.status(401).json({ error: 'File not found.' });
      }
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page, q } = req.query;

    if (q || page) {
      if (!page) {
        const deliverymen = await Deliveryman.findAll({
          where: {
            name: {
              [Op.iLike]: `%${q}%`,
            },
          },
          order: ['id'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        });

        return res.json(deliverymen);
      }

      const { count, rows: deliverymen } = await Deliveryman.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        },
        order: ['id'],
        limit: 7,
        offset: (page - 1) * 7,
        include: {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      });

      return res.json({ deliverymen, count });
    }

    const deliverymen = await Deliveryman.findAll({
      order: ['id'],
    });

    return res.json(deliverymen);
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });
    return res.json(deliveryman);
  }

  async update(req, res) {
    const { email, avatar_id } = req.body;

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found.' });
    }

    if (email !== deliveryman.email) {
      const userExists = await Deliveryman.findOne({
        where: { email },
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      if (userExists) {
        return res
          .status(401)
          .json({ error: 'Email belongs to another deliveryman' });
      }
    }

    if (deliveryman.avatar && deliveryman.avatar.id && avatar_id) {
      if (avatar_id !== deliveryman.avatar.id) {
        File.destroy({
          where: {
            id: deliveryman.avatar.id,
          },
        });
      }
    }

    const updatedDeliveryman = await deliveryman.update(req.body);

    return res.json(updatedDeliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found.' });
    }

    await deliveryman.destroy();

    return res.status(204).send();
  }
}

export default new DeliverymanController();
