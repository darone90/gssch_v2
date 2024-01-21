import { Request, Response} from 'express'
import { ImageData } from "../ts"
import { ImageRepository } from "../repository/Image.repository"

interface MulterRequest extends Request {
  file: any;
}

class ImageController {
  static async addImage(req: MulterRequest, res: Response):Promise<void> {
    const { orginalName, articleId } = req.body 
    try {
      const imageData: ImageData = {
        orginalName: orginalName,
        fileName:  req.file.filename,
        path: `/static/images/${req.file.filename}`,
        articleId: articleId ? articleId : null
      }
      const id = await ImageRepository.addImage(imageData);
      res.json({id});

    } catch (err) {

    }
  }
}

export default ImageController;