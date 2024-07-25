import { Router } from 'express';
import restaurantController from '../controllers/restaurant.controller';
import { restaurantvalidation } from '../validations/restaurant';
import imagevalidation from '../validations/imagevalidation';
import storage from '../middlewares/multer';
import multer from 'multer';
const upload = multer({ storage: storage });

export const restaurantrouter = Router();

restaurantrouter.route('/addrestaurant/:user_id').post(upload.single('image'),
  imagevalidation.handleValidatorErrors, restaurantvalidation, restaurantController.addrestaurant);

restaurantrouter.route('/updaterestaurant/:restaurant_id/:user_id').post(upload.single('image'),
  imagevalidation.handleValidatorErrors, restaurantController.updaterestaurant);

restaurantrouter.route('/removerestaurant/:restaurant_id').get(restaurantController.removerestaurant);

restaurantrouter.route('/getrestaurantdata/:user_id').get(restaurantController.getrestaurantdata);



