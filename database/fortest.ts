import { DataSource } from "typeorm";
import { User } from "../Entities/User.entity";
 
const testDatabase = new DataSource({
    type: "mysql",
    host: "localhost",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    entities:[User],
    logging: false,
    synchronize: true,
    bigNumberStrings: false,
    dropSchema: true
})

export default testDatabase;