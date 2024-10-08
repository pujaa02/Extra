import { Menu } from "../../Types/menu.types"
import { RegData } from "../../Types/register.types"
import { RestaurantAttributes } from "../../Types/restaurant.types"


export const adduser = (user: RegData) => ({
    type: 'ADD_USER',
    payload: { user }
})

export const removeuser = () => ({
    type: 'REMOVE_USER',
    payload: {}
})

export const addrest = (restaurant: RestaurantAttributes) => ({
    type: 'ADD_RESTAURANT',
    payload: { restaurant }
})

export const removeres = () => ({
    type: 'REMOVE_RESTAURANT',
    payload: {}
})

export const addrestid = (id: number) => ({
    type: 'ADD_RESTAURANT_ID',
    payload: { id }
})

export const removerestid = () => ({
    type: 'REMOVE_RESTAURANT_ID'
})

export const add_menu = (item: Menu) => ({
    type: 'ADD_MENU',
    payload: item
})

export const remove_menu = () => ({
    type: 'REMOVE_MENU',
})

export const addmenuid = (id: number) => ({
    type: 'ADD_MENU_ID',
    payload: id
})


export const add_to_cart = (item: Menu) => ({
    type: 'ADD_TO_CART',
    payload: item
})

export const new_cart = (item: Menu) => ({
    type: 'NEW_CART',
    payload: item
})

export const increment = (id: number) => ({
    type: 'INCREMENT_QUANTITY',
    payload: id
})

export const decrement = (id: number) => ({
    type: 'DECREMENT_QUANTITY',
    payload: id
})


export const remove_from_cart = (id: number) => ({
    type: 'REMOVE_FROM_CART',
    payload: id
})


export const emptycart = () => ({
    type: 'EMPTY_CART',
})


export const visible = () => ({
    type: 'VISIBLE',
    payload: {}
})

export const unvisible = () => ({
    type: 'UNVISIBLE',
    payload: {}
})