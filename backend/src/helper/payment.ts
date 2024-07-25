import { prisma } from '..';
import { stringNumObject } from '../types/common';
import { PaymentAttributes } from '../types/payment';

export async function paymentAddQuery(input: PaymentAttributes): Promise<PaymentAttributes> {
  return (await prisma.payment.create({
    data: {
      order_id: Number(input.order_id),
      payment_method: input.payment_method?.toString() || '',
      total_amount: Number(input.total_amount),
      status: input.status?.toString() || '',
    },
  })) as PaymentAttributes;
}

export async function paymentUpdateQuery(condition: stringNumObject, content: object): Promise<{ count: number }> {
  return (await prisma.payment.updateMany({
    where: condition,
    data: content,
  })) as { count: number };
}
