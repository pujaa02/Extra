export const getallrestaurantQuery = async (page: number, search: string) => {
    try {
        const recordsperPage: number = 5;
        const start: number = page * recordsperPage - recordsperPage;
        let restaurants;
        if (search === "nothing") {
            restaurants = await prisma.restaurant.findMany({
                take: recordsperPage,
                skip: start,
                where: {
                    deletedAt: null
                },
            });
        } else {
            restaurants = await prisma.restaurant.findMany({
                take: recordsperPage,
                skip: start,
                where: {
                    deletedAt: null,
                    OR: [
                        {
                            user_id: Number(search)
                        },
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
                        },
                    ],
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
        const totalPages = Math.ceil(totalRestaurants.length / recordsperPage);
        return {
            restaurants,
            success: true,
            message: "Successfully get all restaurants",
            totalPages
        };
    } catch (err) {
        return { success: false, message: "Error occured" };
    }
}
