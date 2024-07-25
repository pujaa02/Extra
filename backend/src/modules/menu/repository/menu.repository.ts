import { prisma } from "../../..";
import { stringNumObject } from "../../../types/common";
import { MenuAttributes } from "../types/menu.types";


export async function menuAddQuery(input: MenuAttributes): Promise<MenuAttributes> {
  return (await prisma.menu.create({
    data: {
      restaurant_id: Number(input.restaurant_id),
      item_name: input.item_name?.toString() || '',
      price: Number(input.price),
      image: input.image?.toString() || '',
    },
  })) as MenuAttributes;
}

export async function menuUpdateQuery(condition: { id: number }, content: object) {
  return (await prisma.menu.update({
    where: condition,
    data: content,
  }));
}

export async function menuFetchQuery(condition: stringNumObject): Promise<MenuAttributes[]> {
  return (await prisma.menu.findMany({ where: condition })) as MenuAttributes[];
}

export async function getRestaurant(input: string) {
  return (await prisma.restaurant.findFirst({
    where: {
      name: input
    }
  }))
}

export async function fetchallmenuquery(condition: stringNumObject) {
  return (await prisma.menu.findMany({
    where: condition,
    select: {
      id: true,
      item_name: true,
      price: true,
      image: true,
      restaurant: {
        select: {
          id: true,
          user_id: true,
          name: true,
          image: true,
        },
      },
    },
  }))
}