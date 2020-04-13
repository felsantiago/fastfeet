import { Op } from 'sequelize';
import { isBefore, parseISO, getHours, startOfDay, endOfDay } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';
import BadRequestException from '../exceptions/BadRequestException';

class StatusService {
  async index(id, page, delivered) {
    const options = {};

    const deliverymanExists = await Deliveryman.findByPk(id, {
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });

    if (!deliverymanExists)
      throw new BadRequestException('Deliveryman not found.');

    const isDelivered = delivered === 'true';

    options.where = {
      end_date: {
        [Op.not]: null,
      },
      deliveryman_id: id,
    };

    options.order = [['created_at', 'ASC']];
    options.include = {
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
    };

    if (page) {
      options.limit = 3;
      options.offset = (page - 1) * 3;
    }

    options.order = ['id'];

    if (isDelivered) {
      const { count, rows: deliveries } = await Delivery.findAndCountAll(
        options
      );

      return { deliveries, deliverymanExists, count };
    }

    throw new BadRequestException('Delivery not provider.');
  }

  async update({ id, deliveryId, data }) {
    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists)
      throw new BadRequestException('Deliveryman not found.');

    const { start_date, end_date, signature_id } = data;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) throw new BadRequestException('Delivery not found.');

    if (start_date) {
      const parsedStartHour = getHours(parseISO(start_date));

      if (parsedStartHour < 8 || parsedStartHour >= 17)
        throw new BadRequestException(
          'You must start a delivery only between 8:00 and 18:00'
        );

      const parsedStartDate = parseISO(start_date);

      if (isBefore(endOfDay(parsedStartDate), new Date()))
        throw new BadRequestException('Past dates are not permitted');

      const { count } = await Delivery.findAndCountAll({
        where: {
          deliveryman_id: id,
          start_date: {
            [Op.between]: [
              startOfDay(parsedStartDate),
              endOfDay(parsedStartDate),
            ],
          },
        },
      });

      if (count >= 5)
        throw new BadRequestException(
          'Error trying to start a new delivery. You already made 5 out of 5 deliveries today.'
        );

      const updatedDelivery = await delivery.update({
        start_date: parsedStartDate,
      });

      return updatedDelivery;
    }

    if (end_date) {
      const parsedEndDate = parseISO(end_date);

      if (isBefore(parsedEndDate, delivery.start_date))
        throw new BadRequestException(
          'Delivery time must be after the withdrawal time.'
        );

      const signature = await File.findByPk(signature_id);

      if (!signature) throw new BadRequestException('Signature not found.');

      const updatedDelivery = await delivery.update({
        end_date: parsedEndDate,
        signature_id,
      });

      return updatedDelivery;
    }

    return { deliveries: [], count: 0 };
  }
}

export default new StatusService();
