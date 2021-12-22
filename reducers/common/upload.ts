
import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface UploadReducer {
  files:object [],
  upload_modal_visible: Boolean,
  title: string
}
interface Settings {
  visible: Boolean,
  title: string
}

const initialState: UploadReducer = {
  files: [],
  upload_modal_visible: false,
  title: ""
}



export const RESET_FILES = "uploadReducer/RESET_FILES";
export const PUSH_FILES = "uploadReducer/PUSH_FILES";
export const SET_UPLOAD_MODAL_VISIBLE = "uploadReducer/SET_UPLOAD_MODAL_VISIBLE"
export const SET_UPLOAD_MODAL_TITLE = "uploadReducer/SET_UPLOAD_MODAL_TITLE"

export const resetFiles = createAction(RESET_FILES)();
export const pushFiles = createAction(PUSH_FILES)<UploadReducer>();
export const setUploadModalVisible = createAction(SET_UPLOAD_MODAL_VISIBLE)<Settings>();

export const actions = { resetFiles, pushFiles, setUploadModalVisible };
type UploadReducerActions = ActionType<typeof actions>;

const uploadReducer = createReducer<UploadReducer, UploadReducerActions>(initialState, {
  [RESET_FILES]: () => ({
    files: [],
    upload_modal_visible: false,
    title: ""
  }),
  [PUSH_FILES]: (state, action) => {
    return ({
      ...state,
      files: [...state.files, ...action.payload.files],
    })
  },
  [SET_UPLOAD_MODAL_VISIBLE]: (state, action) => {
    return ({
      ...state,
      upload_modal_visible: action.payload.visible,
      title: action.payload.title
    })
  },
})

export default uploadReducer;