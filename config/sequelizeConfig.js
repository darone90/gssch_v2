require('dotenv').config({path: 'config/config.env'});

const getTimezone = () => {
  const offset = new Date().getTimezoneOffset();
  const sign = offset <= 0 ? '+' : '-';
  const value = Math.abs(offset) / 60;
  const hours = Math.floor(value);
  const minutes = (value % 1) * 60;
  const stringHours = hours < 10 ? `0${hours}` : hours;
  const stringMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${sign}${stringHours}:${stringMinutes}`;
};

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
  logging: false,
  seederStorage: 'sequelize',
  timezone: getTimezone(),
}

