import { Router } from 'express';
import loginController from '../controllers/login.controller';
import { loginValidation } from '../validations/loginvalidation';

export const userloginrouter = Router();

userloginrouter.route("/login").post(loginValidation, loginController.login);
