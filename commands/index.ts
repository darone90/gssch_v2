import { dotenvService } from '../services/dotenvService';
import vorpal from 'vorpal';
import fs from 'fs';
import { logger } from '../services/loggerService';
dotenvService;

const app = new vorpal();

fs.readdirSync(__dirname).forEach(async (file) => {

  const fileLabelParts = String(file).split('.');
  if (fileLabelParts[fileLabelParts.length - 1] !== 'ts' && fileLabelParts[fileLabelParts.length - 2] !== 'command') {
    logger.warn(`Incorrect file extension of file: ${file}.`, { source: 'VORPAL' });
    return;
  }

  if (file === 'index.ts') return;

  const commandFilePath = `${__dirname}/${file}`;
  let command = await import(commandFilePath);
  command = command.default;

  if (command.hasOwnProperty('name') && command.hasOwnProperty('action')) {
    app.command(command.name, command.description).action(command.action);
  } else {
    logger.error(
      `Incorrect structure of file: ${commandFilePath}. Name and action fields are required`,
      { source: 'VORPAL' }
    );
  }
});

app.delimiter('gssch-service: ').show();