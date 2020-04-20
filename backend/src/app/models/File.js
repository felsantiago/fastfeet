import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        size: Sequelize.INTEGER,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            const url = `${process.env.APP_URL}/files/${this.path}`;
            return url;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
