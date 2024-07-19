select rating.rating,rating.menu_id,menu.restaurant_id,menu.item_name,menu.price,menu.image,restaurant.name
from food_delivery.rating join food_delivery.menu on rating.menu_id=menu.id
join food_delivery.restaurant on restaurant.id=menu.restaurant_id;


const ratingsWithMenuAndRestaurant = await prisma.rating.findMany({
  select: {
    rating: true,
    menu: {
      select: {
        id: true,
        itemName: true,
        price: true,
        image: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});

console.log(ratingsWithMenuAndRestaurant);


const ratingsWithMenuAndRestaurant = await prisma.rating.findMany({
  select: {
    rating: true,
    menu: {
      select: {
        id: true,
        itemName: true,
        price: true,
        image: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});




ratingsWithMenuAndRestaurant.forEach(rating => {
  console.log(`Rating: ${rating.rating}`);
  console.log(`Menu ID: ${rating.menu.id}`);
  console.log(`Item Name: ${rating.menu.itemName}`);
  console.log(`Price: ${rating.menu.price}`);
  console.log(`Image: ${rating.menu.image}`);
  console.log(`Restaurant ID: ${rating.menu.restaurant.id}`);
  console.log(`Restaurant Name: ${rating.menu.restaurant.name}`);
});


ratingsWithMenuAndRestaurant.forEach(({ rating, menu }) => {
  const { id: menuId, itemName, price, image, restaurant } = menu;
  const { id: restaurantId, name: restaurantName } = restaurant;

  console.log(`Rating: ${rating}`);
  console.log(`Menu ID: ${menuId}`);
  console.log(`Item Name: ${itemName}`);
  console.log(`Price: ${price}`);
  console.log(`Image: ${image}`);
  console.log(`Restaurant ID: ${restaurantId}`);
  console.log(`Restaurant Name: ${restaurantName}`);
});


interface Menuall {
    rating: number;
    menu: {
        id: number;
        item_name: string;
        price: number;
        image: string | null;
        restaurant: {
            id: number;
            name: string;
        };

    }
}
