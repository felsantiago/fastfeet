import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import BadRequestException from '../exceptions/BadRequestException';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemService {
  async store({ id, data }) {
    const deliveryExists = await Delivery.findByPk(id, {
      include: {
        model: Deliveryman,
        as: 'deliveryman',
        attributes: ['id', 'name', 'email', 'avatar_id'],
      },
    });

    if (!deliveryExists) throw new BadRequestException('Delivery not found.');

    const { description } = data;

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return { problem, delivery: deliveryExists };
  }

  async index(page) {
    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
      order: ['delivery_id'],
      limit: 7,
      offset: (page - 1) * 7,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: [
            'id',
            'product',
            'deliveryman_id',
            'recipient_id',
            'canceled_at',
          ],
          where: {
            canceled_at: null,
          },
        },
      ],
    });

    return problems;
  }

  async delete(id) {
    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!delivery) throw new BadRequestException('Delivery not found');

    delivery.canceled_at = new Date();

    await delivery.save();

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });

    await Queue.add(CancellationMail.key, {
      delivery,
      problem: problems,
    });

    return delivery;
  }
}

export default new DeliveryProblemService();
