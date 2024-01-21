import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article.entity";

@Entity({name: 'image'})
export class Image extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  orginalName: string

  @Column('text')
  fileName: string

  @Column('text')
  path: string

  @OneToOne(() => Article, (article) => article.mainImage, { nullable: true })
  @ManyToOne(() => Article, (article) => article.images, { nullable: true })
  articleId: string | null
}