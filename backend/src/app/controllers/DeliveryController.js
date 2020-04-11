import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveryController {
  async store(req, res) {
    const { deliveryman_id, recipient_id } = req.body;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman not found.' });
    }

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipientExists) {
      return res.status(401).json({ error: 'Recipient not found.' });
    }

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async index(req, res) {
    const { page, q } = req.query;

    if (q || page) {
      const { count, rows: deliveries } = await Delivery.findAndCountAll({
        where: {
          product: {
            [Op.iLike]: `%${q}%`,
          },
        },
        order: ['id'],
        limit: 7,
        offset: (page - 1) * 7,
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'address_details',
              'state',
              'city',
              'zip_code',
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['url', 'path', 'name'],
          },
        ],
      });

      return res.json({ deliveries, count });
    }

    const deliveries = await Delivery.findAll({
      order: ['id'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'address_details',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path', 'name'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(delivery);
  }

  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    if (deliveryman_id) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { id: deliveryman_id },
      });

      if (!deliverymanExists) {
        return res.status(401).json({ error: 'Deliveryman not found.' });
      }
    }

    if (recipient_id) {
      const recipientExists = await Recipient.findOne({
        where: { id: recipient_id },
      });

      if (!recipientExists) {
        return res.status(401).json({ error: 'Recipient not found.' });
      }
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    await delivery.destroy();

    return res.status(204).send();
  }
}

export default new DeliveryController();
