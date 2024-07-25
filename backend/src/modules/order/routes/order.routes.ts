import { Router } from 'express';
import orderController from '../controller/order.controller';


export const orderrouter = Router();

orderrouter.route('/addorder/:user_id/:restaurant_id').post(orderController.addorder);
orderrouter.route('/cancelorder/:user_id/:restaurant_id/:order_id').get(orderController.cancelorder);
