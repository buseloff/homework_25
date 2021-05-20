import countdownReducer from "./countdownReducer";
import { combineReducers } from "redux";

export default combineReducers({ countdownState: countdownReducer });
