import { prisma } from "../../..";
import { stringNumObject } from "../../../types/common";
import { DriverAttributes } from "../types/driver.types";



export async function driverAddQuery(input: { user_id: number }): Promise<DriverAttributes> {
  return (await prisma.driver.create({
    data: {
      user_id: Number(input.user_id)
    },
  })) as DriverAttributes;
}

export async function driverUpdateQuery(condition: stringNumObject, content: object): Promise<{ count: number }> {
  return (await prisma.driver.updateMany({
    where: condition,
    data: content,
  })) as { count: number };
}
