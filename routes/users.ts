import {Router} from 'express';

const userRouter = Router()

userRouter
  .get('/isloggedin', async (req, res, next) => {
    res
      .json({ok: true})
  })

export default userRouter;