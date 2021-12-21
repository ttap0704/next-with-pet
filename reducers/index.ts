import { combineReducers } from "redux";

// models
import userReducer from "./models/user"
import restaurantReducer from "./models/restaurant";
import accommodationReducer from "./models/accommodation";

// common
import testReducer from "./common/testReducer";
import uploadReducer from "./common/upload";


const rootReducer = combineReducers({
    // models
    userReducer,
    restaurantReducer,
    accommodationReducer,

    // common
    testReducer,
    uploadReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;