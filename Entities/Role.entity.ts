import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm"
import { User } from "./User.entity"

@Entity({name: "role"})
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: string

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}