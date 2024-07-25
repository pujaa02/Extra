import { Router } from 'express';
import ratingController from '../controllers/rating.controller';

export const ratingrouter = Router();

ratingrouter.route('/addrating/:user_id/:restaurant_id').post(ratingController.addrating);
ratingrouter.route('/fetchrating').get(ratingController.fetchrating);

