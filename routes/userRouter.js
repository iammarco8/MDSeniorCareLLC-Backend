import express from 'express';
import { protectUser, mainUser, loginUser, createUser } from '../controllers/userController.js';
import { fullClientList } from '../controllers/customerController.js';

export const userRouter = express.Router();

userRouter
        .route('/keymake')
        .post(createUser)
userRouter
        .route('/login')
        .post(loginUser)
userRouter
        .use(protectUser)
        .route('/clientList')
        .get(fullClientList)