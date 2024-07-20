[
  {
    rating: 4.2,
    menu: {
      id: 1,
      item_name: 'italian pizza',
      price: 150,
      image: 'uploads/image-1721394051818-850304740-italian.jpg',
      restaurant: [Object]
    }
  },
  {
    rating: 3.8,
    menu: {
      id: 2,
      item_name: 'sandwich',
      price: 120,
      image: 'uploads/image-1721394082834-695463509-sandwitch.jpg',
      restaurant: [Object]
    }
  },
  ]
 
select rating.rating,rating.menu_id,menu.restaurant_id,menu.item_name,menu.price,menu.image,restaurant.name
from food_delivery.rating join food_delivery.menu on rating.menu_id=menu.id
join food_delivery.restaurant on restaurant.id=menu.restaurant_id;


select rating.menu_id,(avg(rating.rating),2)
from food_delivery.rating group by rating.menu_id;


const averageRatings = await prisma.rating.groupBy({
  by: ['menuId'],
  _avg: {
    rating: true,
  },
});

const formattedAverageRatings = averageRatings.map(rating => ({
  menuId: rating.menuId,
  avgRating: rating._avg.rating ? rating._avg.rating.toFixed(2) : null, // Handle null cases
}));

console.log(formattedAverageRatings);
