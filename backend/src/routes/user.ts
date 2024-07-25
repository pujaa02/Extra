import { Router } from 'express';
import userController from '../controllers/user.controller';

export const userrouter = Router();

userrouter.route('/getuser').get(userController.getuser);
userrouter.route('/update/:user_id').post(userController.updateuser);
userrouter.route('/delete/:user_id').get(userController.deleteuser);

