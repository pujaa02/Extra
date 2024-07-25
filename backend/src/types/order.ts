export interface OrderAttributes {
  id?: number;
  user_id?: number;
  restaurant_id?: number;
  order_total?: number,
  delivery_status?: string;
  driver_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}