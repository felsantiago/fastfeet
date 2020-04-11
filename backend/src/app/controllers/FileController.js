import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path, size } = req.file;

    const file = await File.create({
      name,
      path,
      size,
    });

    return res.json(file);
  }
}
export default new FileController();
