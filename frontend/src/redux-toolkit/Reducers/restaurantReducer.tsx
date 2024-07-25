import { Action, State_restaurant } from "../../../Types/reducer";


const initialState: State_restaurant = {
    restaurant: {},
};

export default function restaurantReducer(state = initialState, action: Action) {
    switch (action.type) {
        case "ADD_RESTAURANT":
            return state.restaurant = action.payload.restaurant;
        case 'REMOVE_RESTAURANT':
            return state.restaurant = {};
        default:
            return state;
    }
}