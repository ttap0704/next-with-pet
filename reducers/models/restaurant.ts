import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface RestaurantReducer {
  restaurant_list:object []
}

const initialState: RestaurantReducer = {
  restaurant_list: []
}

export const RESET_RESTRAURANT = "restaurantReducer/RESET_RESTRAURANT";
// export const ADD_RESTAURANT = "restaurantReducer/ADD_RESTAURANT";
export const GET_RESTAURANT = "restaurantReducer/GET_RESTAURANT";
export const PUSH_RESTAURANT_LIST = "restaurantReducer/PUSH_RESTAURANT_LIST";


export const resetRestaurant = createAction(RESET_RESTRAURANT)();
// export const addRestaurant = createAction(ADD_RESTAURANT)();
export const getRestaurant = createAction(GET_RESTAURANT)();
export const pushRestaurantList = createAction(PUSH_RESTAURANT_LIST)<RestaurantReducer>();

export const actions = { resetRestaurant, getRestaurant, pushRestaurantList };
type RestaurantReducerActions = ActionType<typeof actions>;

const restaurantReducer = createReducer<RestaurantReducer, RestaurantReducerActions>(initialState, {
  [RESET_RESTRAURANT]: () => ({
    restaurant_list: []
  }),
  // [ADD_RESTAURANT]: (state, action) => {
  //   return ({

  //   })
  // },
  [GET_RESTAURANT]: (state, action) => {
    return state;
  },
  [PUSH_RESTAURANT_LIST]: (state, action: any) => {
    return ({
      restaurant_list: [...state.restaurant_list, ...action.payload]
    })
  }
})

export default restaurantReducer;