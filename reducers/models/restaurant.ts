import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface RestaurantReducer {
  bname: string;
  building_name: string;
  detail_address: string;
  label: string;
  sido: string;
  sigungu: string;
  zonecode: string;
  manager: number;
  entire_menu: [];
  exposure_menu: [];
  files: [];
}

const initialState: RestaurantReducer = {
  bname: "",
  building_name: "",
  detail_address: "",
  label: "",
  sido: "",
  sigungu: "",
  zonecode: "",
  manager: undefined,
  entire_menu: [],
  exposure_menu: [],
  files: [],
}

export const RESET_RESTRAURANT = "restaurantReducer/RESET_RESTRAURANT";
export const ADD_RESTAURANT = "restaurantReducer/ADD_RESTAURANT";

export const resetRestaurant = createAction(RESET_RESTRAURANT)();
export const addRestaurant = createAction(ADD_RESTAURANT)();

export const actions = { resetRestaurant, addRestaurant };
type RestaurantReducerActions = ActionType<typeof actions>;

const restaurantReducer = createReducer<RestaurantReducer, RestaurantReducerActions>(initialState, {
  [RESET_RESTRAURANT]: () => ({
    bname: "",
    building_name: "",
    detail_address: "",
    label: "",
    sido: "",
    sigungu: "",
    zonecode: "",
    manager: undefined,
    entire_menu: [],
    exposure_menu: [],
    files: [],
  }),
  [ADD_RESTAURANT]: (state, action) => {
    console.log(state);
    console.log(action);
    return ({
      bname: "",
      building_name: "",
      detail_address: "",
      label: "",
      sido: "",
      sigungu: "",
      zonecode: "",
      manager: undefined,
      entire_menu: [],
      exposure_menu: [],
      files: []
    })
  }
})

export default restaurantReducer;