import User from '../models/User';
import BadRequestException from '../exceptions/BadRequestException';

class UserService {
  async store({ data }) {
    const { email } = data;
    const userExists = await User.findOne({ where: { email } });

    if (userExists) throw new BadRequestException('User already exists.');

    const user = await User.create(data);

    return user;
  }
}

export default new UserService();
