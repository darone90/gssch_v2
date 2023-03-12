import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity } from "typeorm"
import { Role } from "./Role.entity"

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    hash: string

    @Column()
    login: string
    
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}