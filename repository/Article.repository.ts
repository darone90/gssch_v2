import { ArticleData } from "../ts/repository/article.types";
import { Article } from '../Entities/Article.entity';

export class ArticleRepository {
  static async addArticle(articleData: ArticleData):Promise<string> {
    const article = new Article();
    article.active = articleData.active
    article.title = articleData.title
    article.author = articleData.author
    article.content = articleData.content
    article.date = articleData.date
    await article.save()
    return article.id
  }
}

