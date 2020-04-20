import { Op } from 'sequelize';

import Recipient from '../models/Recipient';
import BadRequestException from '../exceptions/BadRequestException';

class RecipientService {
  async store({ data }) {
    const { name, street, number, zip_code } = data;

    const recipientExists = await Recipient.findOne({
      where: { name, street, number, zip_code },
    });

    if (recipientExists)
      throw new BadRequestException('Recipient already exists.');

    const recipient = await Recipient.create(data);

    return recipient;
  }

  async show(id) {
    const recipient = await Recipient.findByPk(id);

    return recipient;
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
    }

    options.order = ['id'];

    const { count, rows: recipients } = await Recipient.findAndCountAll(
      options
    );

    return { recipients, count };
  }

  async update({ id, data }) {
    const recipient = await Recipient.findByPk(id);

    if (!recipient) throw new BadRequestException('Recipient not found');

    const recipientUpdated = await recipient.update(data);

    return recipientUpdated;
  }

  async delete(id) {
    const recipient = await Recipient.findByPk(id);

    if (!recipient) throw new BadRequestException('Recipient not found.');

    await recipient.destroy();
  }
}

export default new RecipientService();
