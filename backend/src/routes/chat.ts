import { Router } from 'express';
import chatController from '../controllers/chat.controller';

export const chatrouter = Router();


chatrouter.route('/addchatdata').post(chatController.addchatdata);
chatrouter.route('/getchatdata').get(chatController.getchatdata);