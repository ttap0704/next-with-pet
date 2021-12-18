import { combineReducers } from "redux";

// models
import userReducer from "./models/user"
import restaurantReducer from "./models/restaurant";
import accommodationReducer from "./models/accommodation";

// common
import testReducer from "./common/testReducer";


const rootReducer = combineReducers({
    // models
    userReducer,
    restaurantReducer,
    accommodationReducer,

    // common
    testReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;