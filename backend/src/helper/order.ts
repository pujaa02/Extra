import { prisma } from '..';
import { stringNumObject } from '../types/common';
import { OrderAttributes } from '../types/order';

export async function orderAddQuery(input: OrderAttributes): Promise<OrderAttributes> {
  return (await prisma.order.create({
    data: {
      user_id: Number(input.user_id),
      restaurant_id: Number(input.restaurant_id),
      total_amount: Number(input.order_total),
    },
  })) as OrderAttributes;
}

export async function orderUpdateQuery(condition: stringNumObject, content: object): Promise<{ count: number }> {
  return (await prisma.order.updateMany({
    where: condition,
    data: content,
  })) as { count: number };
}

export async function orderFetchquery(condition: stringNumObject): Promise<OrderAttributes> {
  return (await prisma.order.findMany({ where: condition })) as OrderAttributes;
}
