import { logger } from '../services/loggerService';
import { dotenvService } from '../services/dotEnvService';
import { DataSource } from "typeorm";
import { User } from '../Entities/User.entity';
import { Role } from "../Entities/Role.entity";
dotenvService;

const entities = [User, Role]

const migrationsDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities,
  logging: false,
  synchronize: true,
});

(async () => {
  try {
    await migrationsDataSource.initialize();
    logger.info(`Start migration to database ${process.env.DB_NAME}...`, {source: 'DATABASE'});
    for(const entity of entities) {
      logger.info(`Add ${entity.name} to ${process.env.DB_NAME}`,{source: 'DATABASE'});
    };
    logger.info(`Migration compelted: connection will be closed...`, {source: "DATABASE"});
    await migrationsDataSource.destroy();
  } catch(error) {
    logger.error(`Error during migration to: ${process.env.DB_NAME} Error info: ${error.message}`, {source: "DATABASE"});
  }
})();



