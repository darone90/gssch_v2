import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity } from "typeorm"

@Entity({name: "user"})
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    hash: string

    @Column()
    login: string

    @Column({
        nullable: true
    })
    token: string | null
    
    @CreateDateColumn()
    created_at: Date;
}