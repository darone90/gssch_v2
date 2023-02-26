import { logger } from './loggerService';
import dotenv from 'dotenv';

class DotenvService {

  constructor() {
    this.init();
  }

  init() {
    const envFile = dotenv.config({ path: 'config/config.env' });

    if (envFile.error) {
      const noFileMessage =
        'No config file in /config/config.env. Add the file to run the app properly';
      logger.error(noFileMessage, { source: 'DOTENV' });

      return;
    }
    const successMessage = 'Env config was successfull';
    logger.debug(successMessage, { source: 'DOTENV' });
  }
}

export const dotenvService = new DotenvService();