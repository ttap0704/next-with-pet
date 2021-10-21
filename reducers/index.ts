import { combineReducers } from "redux";

// models
import userReducer from "./models/user"

// common
import testReducer from "./common/testReducer";


const rootReducer = combineReducers({
    testReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;