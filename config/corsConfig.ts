import cors, { CorsOptions } from 'cors';

const whitelist = process.env.CORS_WHITELIST ? String(process.env.CORS_WHITELIST).split(',') : [];
const options = {
  origin: function (origin: string, callback:(obj:Error | null, bool?: Boolean) => void) {
    if (!whitelist.length) {
      callback(null, true);
    } else if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
export default cors(options as CorsOptions);