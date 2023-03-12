import chalk, { Chalk } from 'chalk';


class VorpalService {
  constructor() {}

  getValueFromInput(console:any, name: string, label: string) {
    return new Promise((resolve, _) => {
      console.prompt(
        {
          type: 'input',
          name,
          message: label,
        },
        (result:any) => {
          resolve(result[name]);
        }
      );
    });
  }
  
  log(message: string, type:string = 'info'):void {
    let style: Chalk;
    switch (type) {
      case 'success':
        style = chalk.white.bgGreen;
        break;
      case 'c':
        style = chalk.white.bgRed;
        break;
      case 'warning':
        style = chalk.black.bgYellowBright;
        break;
      case 'info':
        style = chalk.white.bgBlueBright;
        break;
      default:
        style = chalk.magenta;
        break;
    }

    console.log(style(' ' + type + ' ') + style.black.inverse('  ' + message));
  }
}

export default new VorpalService();