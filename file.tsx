import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Restaurant = {
  id: number;
  name: string;
  phone: string;
  user_id: number;
  deletedAt: Date | null;
};

type GetAllRestaurantResponse = {
  restaurants: Restaurant[];
  success: boolean;
  message: string;
  totalPages: number;
};

export const getallrestaurantQuery = async (page: number, search: string): Promise<GetAllRestaurantResponse> => {
  try {
    const recordsperPage: number = 5;
    const start: number = page * recordsperPage - recordsperPage;
    let restaurants: Restaurant[];

    if (search === "nothing") {
      restaurants = await prisma.restaurant.findMany({
        take: recordsperPage,
        skip: start,
        where: {
          deletedAt: null
        },
      });
    } else {
      const searchConditions: any[] = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive'
          },
        }
      ];

      // Check if search can be converted to a valid number
      const searchAsNumber: number = Number(search);
      if (!isNaN(searchAsNumber)) {
        searchConditions.push({
          user_id: searchAsNumber
        });
      }

      restaurants = await prisma.restaurant.findMany({
        take: recordsperPage,
        skip: start,
        where: {
          deletedAt: null,
          OR: searchConditions,
        },
      });
    }

    const totalRestaurants = await prisma.restaurant.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
      },
    });

    const totalPages: number = Math.ceil(totalRestaurants.length / recordsperPage);

    return {
      restaurants,
      success: true,
      message: "Successfully get all restaurants",
      totalPages
    };
  } catch (err) {
    return { success: false, message: "Error occurred" };
  }
};
