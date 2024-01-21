import { ImageData } from "../ts";
import { Image } from "../Entities/Image.entity";
import { IsNull } from "typeorm";

export class ImageRepository {
  static async addImage(imageData: ImageData): Promise<number> {
    const image = new Image();
    image.orginalName = imageData.orginalName;
    image.fileName = imageData.fileName;
    image.path = imageData.path;
    image.articleId = imageData.articleId ? imageData.articleId : null
    await image.save();
    return image.id; 
  }

  static async addImages(imagesData: ImageData[]): Promise<number[]> {
    const idsResult:number[] = [];
    for(let i:any; i<= imagesData.length; i++ ) {
      const id = await this.addImage(imagesData[i]);
      idsResult.push(id);
    }
    return idsResult;
  }

  static async deleteById(id:number):Promise<string | null> {
    const image = await Image.findOne({
      where: {
        id
      }
    })
    if(!image) return null;
    const path = image.path;
    await image.remove()
    return path
  }

  static async updateArticleImages(articleId: string, images:ImageData[]):Promise<boolean> { 
    await Image.delete({articleId});
    await this.addImages(images);
    return true;
  }

  static async clearUnassignedImages():Promise<boolean> {
    await Image.delete({articleId: IsNull()});
    return true;
  }
}