import { State_sidebar, Reducer_Action } from "../../Types/reducer.types";

const initialState: State_sidebar = {
    show: false,
}

export default function sidebarReducer(state = initialState, action: Reducer_Action) {
    switch (action.type) {
        case 'VISIBLE':
            return {show:state.show = true}
        case 'UNVISIBLE':
            return {show:state.show = false}
        default:
            return state;
    }
}
