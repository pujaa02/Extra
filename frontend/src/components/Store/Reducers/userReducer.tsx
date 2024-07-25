import { Action, State_user } from "../../../Types/reducer";
const initialState: State_user = {
    user: { bd: new Date() },
}

export default function userReducer(state = initialState, action: Action) {
    switch (action.type) {
        case 'ADD_USER':
            return state.user = action.payload.user;
        case 'REMOVE_USER':
            return state.user = { bd: new Date() };
        default:
            return state
    }
}

