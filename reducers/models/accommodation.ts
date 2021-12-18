import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface AccommodationReducer {
  accommodation_list:object []
}

const initialState: AccommodationReducer = {
  accommodation_list: []
}

export const RESET_ACCOMMODATION = "accommodationReducer/RESET_ACCOMMODATION";
// export const ADD_ACCOMMODATION = "accommodationReducer/ADD_ACCOMMODATION";
export const GET_ACCOMMODATION = "accommodationReducer/GET_ACCOMMODATION";
export const PUSH_ACCOMMODATION_LIST = "accommodationReducer/PUSH_ACCOMMODATION_LIST";


export const resetAccommodation = createAction(RESET_ACCOMMODATION)();
// export const addAccommodation = createAction(ADD_ACCOMMODATION)();
export const getAccommodation = createAction(GET_ACCOMMODATION)();
export const pushAccommodationList = createAction(PUSH_ACCOMMODATION_LIST)<AccommodationReducer>();

export const actions = { resetAccommodation, getAccommodation, pushAccommodationList };
type AccommodationReducerActions = ActionType<typeof actions>;

const accommodationReducer = createReducer<AccommodationReducer, AccommodationReducerActions>(initialState, {
  [RESET_ACCOMMODATION]: () => ({
    accommodation_list: []
  }),
  // [ADD_ACCOMMODATION]: (state, action) => {
  //   return ({

  //   })
  // },
  [GET_ACCOMMODATION]: (state, action) => {
    return state;
  },
  [PUSH_ACCOMMODATION_LIST]: (state, action: any) => {
    return ({
      accommodation_list: [...state.accommodation_list, ...action.payload]
    })
  }
})

export default accommodationReducer;