import { Request, Response } from 'express';
import { driverAddQuery, driverUpdateQuery } from '../helper/driver';

const adddriver = async (req: Request, res: Response) => {
  try {
    await driverAddQuery({ user_id: Number(req.params.user_id) })
    res.status(200).send({ message: 'success' });
  } catch (error) {
    return res.status(500).send({ message: 'failed' });
  }
};

const removedriver = async (req: Request, res: Response) => {
  const driverid: number = Number(req.params.driver_id);
  try {
    await driverUpdateQuery({ id: driverid }, { deletedAt: new Date() });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    return res.status(500).send({ message: 'failed' });
  }
};

export default { adddriver, removedriver };
