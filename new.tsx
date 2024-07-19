select rating.rating,rating.menu_id,menu.restaurant_id,menu.item_name,menu.price,menu.image,restaurant.name
from food_delivery.rating join food_delivery.menu on rating.menu_id=menu.id
join food_delivery.restaurant on restaurant.id=menu.restaurant_id;
