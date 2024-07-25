import { Request, Response } from 'express';
import { OrderAttributes } from '../types/order';
import { orderAddQuery, orderFetchquery, orderUpdateQuery } from '../helper/order';
import { paymentAddQuery } from '../helper/payment';

const addorder = async (req: Request, res: Response) => {
  try {
    const result: OrderAttributes = await orderAddQuery({
      user_id: Number(req.params.user_id),
      restaurant_id: Number(req.params.restaurant_id),
      order_total: Number(req.body.order_total),
      delivery_status: 'pending',
      driver_id: 1,
    });
    if (result.id) {
      await paymentAddQuery({
        order_id: result.id,
        payment_method: req.body.payment_method,
        total_amount: Number(req.body.total_amount),
        status: 'success',
      });
    }
    res.status(200).send({ message: 'success' });
  } catch (error) {
    return res.status(500).send({ message: 'failed' });
  }
};


const cancelorder = async (req: Request, res: Response) => {
  try {
    const result:OrderAttributes = await orderFetchquery({
      user_id: Number(req.params.user_id),
      restaurant_id: Number(req.params.restaurant_id),
      id: Number(req.params.order_id),
    });
    if (result) {
      await orderUpdateQuery({ id: Number(req.params.order_id) }, { deletedAt: new Date() });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'failed' });
  }
};

export default { addorder, cancelorder };
