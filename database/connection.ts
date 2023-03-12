import { DataSource } from "typeorm";
import { User } from '../Entities/User.entity';
import { Role } from '../Entities/Role.entity';

const environment = process.argv[2];
 
const gsschDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities:[User, Role],
    logging: environment === "dev" ? true : false,
    bigNumberStrings: false,
})

export default gsschDataSource;