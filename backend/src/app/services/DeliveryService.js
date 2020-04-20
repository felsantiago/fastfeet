import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import BadRequestException from '../exceptions/BadRequestException';

import DetailsMail from '../jobs/DetailsMail';
import Queue from '../../lib/Queue';

class DeliveryService {
  async store({ data }) {
    const { deliveryman_id, recipient_id } = data;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverymanExists)
      throw new BadRequestException('Deliveryman not found.');

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipientExists) throw new BadRequestException('Recipient not found.');

    const delivery = await Delivery.create(data);

    await Queue.add(DetailsMail.key, {
      recipient: recipientExists,
      deliveryman: deliverymanExists,
    });

    return delivery;
  }

  async show(id) {
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

    return delivery;
  }

  async index(name, page) {
    const options = {};

    if (name || page) {
      if (name !== undefined && name !== '')
        options.where = {
          product: {
            [Op.iLike]: `%${name}%`,
          },
        };

      if (page) {
        options.limit = 7;
        options.offset = (page - 1) * 7;
      }

      options.include = [
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
      ];
    }

    options.order = ['id'];

    const { count, rows: deliveries } = await Delivery.findAndCountAll(options);

    return { deliveries, count };
  }

  async update({ id, data }) {
    const delivery = await Delivery.findByPk(id);

    if (!delivery) throw new BadRequestException('Delivery not found.');

    const { deliveryman_id, recipient_id } = data;

    if (deliveryman_id) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { id: deliveryman_id },
      });

      if (!deliverymanExists)
        throw new BadRequestException('Deliveryman not found.');
    }

    if (recipient_id) {
      const recipientExists = await Recipient.findOne({
        where: { id: recipient_id },
      });

      if (!recipientExists)
        throw new BadRequestException('Recipient not found.');
    }

    const updatedDelivery = await delivery.update(data);

    return updatedDelivery;
  }

  async delete(id) {
    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!delivery) throw new BadRequestException('Delivery not found.');

    await delivery.destroy();
  }
}

export default new DeliveryService();
