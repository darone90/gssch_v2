import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { LoggerStream, logger } from './services/loggerService';
import corsConfig from './config/corsConfig';
import { dotenvService } from './services/dotEnvService';
import connection from './database/connection';
import errorHandleMiddleware from './middlewares/errorHandleMiddleware';

const app = express();

app.use(morgan('combined', {stream: new LoggerStream()}));
dotenvService;
app.use(corsConfig);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', router);
app.use(errorHandleMiddleware)

connection
  .initialize()
  .then(() => {
    logger.info("Database connected", {source: 'DATABASE'})
  })
  .catch((err) => {
    logger.error(`database connection error ${err}`, {source: 'DATABASE'})
  })

logger.info(`Listening: http://localhost:${process.env.APP_PORT || '5000'}/`, {
  source: 'APP',
});

export default app;