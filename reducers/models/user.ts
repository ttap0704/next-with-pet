import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

// 상태의 타입 선언
interface UserReducer {
  uid: number,
  unick: string,
}

// 상태 초기화
const initialState: UserReducer = {
  uid: 0,
  unick: "",
}

// 액션타입 선언
export const RESET_USER = "userReducer/RESET_USER";
export const ADD_USER = "userReducer/ADD_USER";
export const REMOVE_TEXT = "userReducer/REMOVE_TEXT";

// 액션함수 선언
export const resetUser = createAction(RESET_USER)();
export const addUser = createAction(ADD_USER)<UserReducer>()
export const removeText = createAction(REMOVE_TEXT)()

// 액션 객체타입
export const actions = { resetUser, addUser, removeText }
type UserReducerActions = ActionType<typeof actions>;

// 리듀서 추가
const userReducer = createReducer<UserReducer, UserReducerActions>(initialState, {
  [RESET_USER]: () => ({
    uid: 0,
    unick: "",
  }),
  [ADD_USER]: (state, action) => {
    console.log(state.text)
    return ({
      no: action.payload.no,
      text: action.payload.text
    })
  },
})

export default userReducer;