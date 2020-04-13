import User from '../models/User';
import Notification from '../schemas/Notification';
import BadRequestException from '../exceptions/BadRequestException';

class NotificationService {
  async index(id) {
    const checkIsProvider = await User.findOne({
      where: { id, provider: true },
    });

    if (!checkIsProvider)
      throw new BadRequestException('Only provider can load notifications');

    const notifications = await Notification.find({
      user: id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return notifications;
  }

  async update(id) {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    return notification;
  }
}

export default new NotificationService();
