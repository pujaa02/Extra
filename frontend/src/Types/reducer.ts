/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu } from "./menu";
import { RegData } from "./register";
import { RestaurantAttributes } from "./restaurant";

export interface State_user {
    user: RegData,
}
export interface State_cart {
    cart: Menu[],
    total: number;
    totalItems: number;
}
export interface Action {
    payload: any;
    type: string;
}

export interface State_sidebar {
    show: boolean
}
export interface State {
    user: State_user,
    cart: State_cart,
    show: State_sidebar,
    restaurant: State_restaurant,
    menu: State_menu,
    restID: State_restID,
}

export interface State_restaurant {
    restaurant: RestaurantAttributes,
}
export interface State_menu {
    menu: Menu[],
    menuID: number
}

export interface State_restID {
    receiverID: number;
}