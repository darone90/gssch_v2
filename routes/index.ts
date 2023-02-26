import { Router } from 'express';
import fs from 'fs';

const router = Router();

(async function () {
  const files = fs.readdirSync('./routes');
  try {
  for (const file of files) {
    if (file.includes('.ts') && file !== 'index.ts') {
      const name = file.split('.ts')[0];
      const routerModule = await import(`./${name}`);
      router.use(`/${name}`, routerModule.default);
    }
  }
  } catch (err) {
    console.log(err)
  }
})();

export default router;
