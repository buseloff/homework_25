import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ACTION_TYPES from "../../actions/actionTypes";
import {
  format,
  endOfDay,
  startOfDay,
  getHours,
  getMinutes,
  getSeconds,
  milliseconds,
} from "date-fns";
import countdownStyles from "./Countdown.module.css";

function Countdown(props) {
  const {
    count,
    step,
    isRunning,
    speedCount,
    directionCount,
    error,
    increment,
    decrement,
    switchDirection,
    switchIsRunning,
    getError,
    setNewCount,
  } = props;

  useEffect(() => {
    if (step > 10000000) {
      getError(new Error("Invalid step! Must be less than 10 000 000."));
    }
    if (!directionCount && isRunning) {
      const intervalId = setInterval(() => {
        decrement();
      }, speedCount);

      if (
        milliseconds({
          hours: getHours(count),
          minutes: getMinutes(count),
          seconds: getSeconds(count),
        }) <= step
      ) {
        setNewCount(startOfDay(count));
        switchIsRunning();
      }
      return () => {
        clearInterval(intervalId);
      };
    }

    if (directionCount && isRunning) {
      const intervalId = setInterval(() => {
        increment();
      }, speedCount);

      if (
        milliseconds({
          hours: getHours(endOfDay(count)) - getHours(count),
          minutes: getMinutes(endOfDay(count)) - getMinutes(count),
          seconds: getSeconds(endOfDay(count)) - getSeconds(count),
        }) <= step
      ) {
        setNewCount(endOfDay(count));
        switchIsRunning();
      }
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    isRunning,
    count,
    step,
    speedCount,
    directionCount,
    increment,
    decrement,
    setNewCount,
    switchIsRunning,
    getError,
  ]);

  if (error) {
    return <div className={countdownStyles.error_style}>{error.message}</div>;
  }

  return (
    <div className={countdownStyles.wrapper}>
      <h1 className={countdownStyles.time_style}>
        {format(count, "HH:mm:ss.SSS")}
      </h1>

      <div className={countdownStyles.btn_wrap}>
        <button onClick={() => switchIsRunning()}>
          {isRunning ? "stop" : "start"}
        </button>
        <button
          onClick={() => {
            if (!directionCount) {
              setNewCount(endOfDay(new Date()));
            }
            if (directionCount) {
              setNewCount(startOfDay(new Date()));
            }
          }}
        >
          reset
        </button>
        <button onClick={() => switchDirection()}>switch</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { countdownState } = state;
  return countdownState;
};

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch({ type: ACTION_TYPES.COUNT_INCREMENT }),
    decrement: () => dispatch({ type: ACTION_TYPES.COUNT_DECREMENT }),
    switchDirection: () =>
      dispatch({ type: ACTION_TYPES.CHANGE_DIRECTION_COUNT }),
    switchIsRunning: () => dispatch({ type: ACTION_TYPES.CHANGE_IS_RUNNING }),
    getError: (error) => dispatch({ type: ACTION_TYPES.GET_ERROR, error }),
    setNewCount: (newCount) =>
      dispatch({ type: ACTION_TYPES.CHANGE_COUNT, newCount }),
  };
};

Countdown.propTypes = {
  count: PropTypes.instanceOf(Date).isRequired,
  step: PropTypes.number.isRequired,
  speedCount: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  directionCount: PropTypes.bool.isRequired,
};

Countdown.defaultProps = {
  step: 133,
  speedCount: 10,
  isRunning: false,
  directionCount: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
