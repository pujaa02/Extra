import { Router } from 'express';
import driverController from '../controllers/driver.controller';

export const driverrouter = Router();

driverrouter.route('/adddriver/:user_id').get(driverController.adddriver);
driverrouter.route('/removedriver/:driver_id').get(driverController.removedriver);
