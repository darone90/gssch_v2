import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./Image.entity";

@Entity({name: "article"})
export class Article extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  active: boolean

  @Column('text')
  title: string

  @Column('text')
  author: string

  @Column('date')
  date: Date

  @Column('longtext')
  content: string

  @OneToOne(() => Image, (image) => image.articleId)
  mainImage: Image

  @OneToMany(() => Image, (image) => image.articleId)
  images: Image[]
}