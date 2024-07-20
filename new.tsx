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
