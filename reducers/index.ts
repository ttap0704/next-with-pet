import { combineReducers } from "redux";

// models
import userReducer from "./models/user"
import restaurantReducer from "./models/restaurant";

// common
import testReducer from "./common/testReducer";


const rootReducer = combineReducers({
    // models
    userReducer,
    restaurantReducer,

    // common
    testReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;