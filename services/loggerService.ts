import winston from 'winston';
import chalk from 'chalk';
import { Formatter } from '../ts';

const httpFilter = winston.format((info) => {
  return info.level === 'http' ? info : false;
});

const messageFormatter = function ({ source, level, message, timestamp }: Formatter): string {
  const color = {
    error: 'redBright',
    warn: 'yellow',
    info: 'blueBright',
    http: 'white',
    verbose: 'white',
    debug: 'cyanBright',
    silly: 'magenta',
  };

  const bg: string = `bg${color[level].charAt(0).toUpperCase() + color[level].slice(1)}`;
  const time: string = timestamp.replace('T', ' ').replace('Z', '');

  return chalk`{${color[level]} [${source}]} {black {${bg}  ${level}: }} {${color[level]} [${time}] ${message}}`;
};

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error', 
      maxsize: 2000000 
    }),
    new winston.transports.File({
      filename: 'logs/http.log',
      level: 'http',
      format: httpFilter(),
      maxsize: 2000000,
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.printf((info) => messageFormatter(info as Formatter))),
    }),
  ],
});

export class LoggerStream {
  write(message: string) {
      logger.info(message);
  }
}

if (process.env.NODE_ENV === 'test' ) {
  logger.transports.forEach((t) => (t.silent = true));
}

