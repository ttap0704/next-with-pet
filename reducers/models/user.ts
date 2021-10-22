import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

// 상태의 타입 선언
interface UserReducer {
  uid: number,
  unick: string,
  profile_img_path: string
}

// 상태 초기화
const initialState: UserReducer = {
  uid: 0,
  unick: "",
  profile_img_path: ""
}

// 액션타입 선언
export const RESET_USER = "userReducer/RESET_USER";
export const ADD_USER = "userReducer/ADD_USER";

// 액션함수 선언
export const resetUser = createAction(RESET_USER)();
export const addUser = createAction(ADD_USER)<UserReducer>();

// 액션 객체타입
export const actions = { resetUser, addUser }
type UserReducerActions = ActionType<typeof actions>;

// 리듀서 추가
const userReducer = createReducer<UserReducer, UserReducerActions>(initialState, {
  [RESET_USER]: () => ({
    uid: 0,
    unick: "",
    profile_img_path: ""
  }),
  [ADD_USER]: (state, action) => {
    return ({
      uid: action.payload.uid,
      unick: action.payload.unick,
      profile_img_path: action.payload.profile_img_path
    })
  },
})

export default userReducer;