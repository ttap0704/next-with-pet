import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface RestaurantReducer {
  
}

const initialState: RestaurantReducer = {
}

export const RESET_USER = "userReducer/RESET_USER";
export const ADD_USER = "userReducer/ADD_USER";

export const resetUser = createAction(RESET_USER)();

export const actions = {}
type RestaurantReducerActions = ActionType<typeof actions>;

const restauranteducer = createReducer<RestaurantReducer, RestaurantReducerActions>(initialState, {
})

export default restauranteducer;