import { Request, Response } from 'express';
import { CartBody, Cartdata } from '../types/cart';
import { cartaddupdate, cartUpdateQuery, fetchCartData } from '../helper/cart';
import { MenuAttributes } from '../types/menu';
import { menuFetchQuery } from '../helper/menu';
import _ from "lodash";

const addtocart = async (req: Request, res: Response) => {
  const data: CartBody[] = req.body;
  await cartUpdateQuery({ user_id: Number(req.params.user_id) }, { deletedAt: new Date() })
  try {
    data.forEach(async (item: CartBody) => {
      await cartaddupdate({
        user_id: Number(req.params.user_id),
        menu_id: Number(item.menu_id),
        count: Number(item.count),
      });
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'failed' });
  }
};

const getcarddata = async (req: Request, res: Response) => {
  const user_id: number = Number(req.params.user_id);

  try {
    const cartdata: Cartdata[] = await fetchCartData(user_id);
    const menudata: MenuAttributes[] = [];

    await Promise.all(cartdata.map(async (item: Cartdata) => {
      const menu_data: MenuAttributes[] = await menuFetchQuery({ id: item.menu_id });
      menudata.push(menu_data[0]);
    }))

    const finalresult: Cartdata[] & MenuAttributes[] = _.merge(cartdata, menudata);
    res.status(200).send({ message: 'success', result: finalresult });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'failed' });
  }
}

const removecartdata = async (req: Request, res: Response) => {
  try {
    await cartUpdateQuery({ user_id: Number(req.params.user_id) }, { deletedAt: new Date() })
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'failed' });
  }
}

export default { addtocart, getcarddata, removecartdata };
