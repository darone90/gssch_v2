import { NextFunction, Request, Response } from "express";
import HTTPError from "../errors/httpError";
import { logger } from "../services/loggerService";

const errorHandleMiddleware = (err:any, req: Request, res: Response, next: NextFunction) => {

  if(err instanceof HTTPError) {
    logger.error(`Error during ${err.blockName}: ${err.message}`, {source: err.source})
    res
      .status(err.code)
      .json({info: 'internal server error'})
  } else {
    logger.error(`Unexpected error`, {source: "ERROR MIDDLEWARE"})
    res
      .status(500)
      .json({info: 'internal server error'})
  }
}

export default errorHandleMiddleware