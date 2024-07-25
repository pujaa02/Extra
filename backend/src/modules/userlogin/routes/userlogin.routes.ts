import { Router } from 'express';
import { loginValidation } from '../validations/loginvalidation';
import loginController from '../controller/login.controller';

export const userloginrouter = Router();

userloginrouter.route("/login").post(loginValidation, loginController.login);
