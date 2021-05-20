import ACTION_TYPES from "../actions/actionTypes";
import { endOfDay, subMilliseconds, addMilliseconds } from "date-fns";

const initialState = {
  count: endOfDay(new Date()),
  step: 133,
  isRunning: false,
  speedCount: 10,
  directionCount: false,
  error: null,
};

const countdownReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.COUNT_INCREMENT:
      return { ...state, count: addMilliseconds(state.count, state.step) };
    case ACTION_TYPES.COUNT_DECREMENT:
      return { ...state, count: subMilliseconds(state.count, state.step) };
    case ACTION_TYPES.CHANGE_DIRECTION_COUNT:
      return { ...state, directionCount: !state.directionCount };
    case ACTION_TYPES.CHANGE_IS_RUNNING:
      return { ...state, isRunning: !state.isRunning };
    case ACTION_TYPES.GET_ERROR:
      return { ...state, isRunning: false, error: action.error };
    case ACTION_TYPES.CHANGE_COUNT:
      return { ...state, count: action.newCount };
    default:
      return state;
  }
};
export default countdownReducer;
