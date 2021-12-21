
import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface UploadReducer {
  files:object [],
  upload_modal_visible: Boolean
}

interface Visible {
  visible: Boolean
}

const initialState: UploadReducer = {
  files: [],
  upload_modal_visible: false,
}



export const RESET_FILES = "uploadReducer/RESET_FILES";
export const PUSH_FILES = "uploadReducer/PUSH_FILES";
export const SET_UPLOAD_MODAL_VISIBLE = "uploadReducer/SET_UPLOAD_MODAL_VISIBLE"


export const resetFiles = createAction(RESET_FILES)();
export const pushFiles = createAction(PUSH_FILES)<UploadReducer>();
export const setUploadModalVisible = createAction(SET_UPLOAD_MODAL_VISIBLE)<Visible>();

export const actions = { resetFiles, pushFiles, setUploadModalVisible };
type UploadReducerActions = ActionType<typeof actions>;

const uploadReducer = createReducer<UploadReducer, UploadReducerActions>(initialState, {
  [RESET_FILES]: () => ({
    files: [],
    upload_modal_visible: false
  }),
  [PUSH_FILES]: (state, action: any) => {
    return ({
      files: [...state.files, ...action.payload],
      upload_modal_visible: state.upload_modal_visible
    })
  },
  [SET_UPLOAD_MODAL_VISIBLE]: (state, action: any) => {
    console.log(state)
    console.log(action)
    return ({
      upload_modal_visible: action.payload.visible,
      files: [...state.files]
    })
  }
})

export default uploadReducer;