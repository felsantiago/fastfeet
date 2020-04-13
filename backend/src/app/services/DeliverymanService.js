import { Op } from 'sequelize';

import BadRequestException from '../exceptions/BadRequestException';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanService {
  async store({ data }) {
    const { avatar_id, email } = data;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists)
      throw new BadRequestException('Deliveryman already exists.');

    if (avatar_id) {
      const file = await File.findOne({
        where: { id: avatar_id },
      });

      if (!file) throw new BadRequestException('File not found.');
    }

    const { id, name } = await Deliveryman.create(data);

    return {
      id,
      name,
      email,
    };
  }

  async index(name, page) {
    const options = {};

    if (name || page) {
      if (name !== undefined && name !== '')
        options.where = {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        };

      if (page) {
        options.limit = 7;
        options.offset = (page - 1) * 7;
      }

      options.include = [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ];
    }

    options.order = ['id'];

    const { count, rows: deliveryman } = await Deliveryman.findAndCountAll(
      options
    );

    return { deliveryman, count };
  }

  async update({ id, data }) {
    const { email, avatar_id } = data;

    const options = {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    };

    const deliveryman = await Deliveryman.findByPk(id, options);

    if (!deliveryman) throw new BadRequestException('Deliveryman not found.');

    if (email !== deliveryman.email) {
      options.where = { email };

      const userExists = await Deliveryman.findOne(options);

      if (userExists)
        throw new BadRequestException('Email belongs to another deliveryman');
    }

    if (deliveryman.avatar && !deliveryman.avatar.id)
      throw new BadRequestException('Avatar Id not found.');

    if (deliveryman.avatar && deliveryman.avatar.id && avatar_id) {
      if (avatar_id !== deliveryman.avatar.id) {
        File.destroy({
          where: {
            id: deliveryman.avatar.id,
          },
        });
      }
    }

    const updatedDeliveryman = await deliveryman.update(data);

    return updatedDeliveryman;
  }

  async delete(id) {
    const deliveryman = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) throw new BadRequestException('Deliveryman not found.');

    await deliveryman.destroy();
  }
}

export default new DeliverymanService();
