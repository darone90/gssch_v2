// import { dotenvService } from '../services/dotEnvService';
// import { logger } from '../services/loggerService';
// import gsschDataSource from './connection';
// import seeders from './seeders';
// dotenvService;
// (async () => {
//   try {
//     await gsschDataSource.initialize()
//     logger.info(`Seeders initialization....`, {source: "DATABASE"})
//     for(const seed of seeders) {
//       await seed();
//       logger.info(`Seed ${seed.name} added to database`, {source: "DATABASE"})
//     }
//     logger.info(`Data uploaded to database. Connection will be closed...`, {source: "DATABASE"})
//     gsschDataSource.destroy()
//   } catch(error) {
//     logger.info(`Error during seeders loading to database. Error info: ${error.message}`)
//   }
// })()
