import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  format,
  subMilliseconds,
  endOfDay,
  startOfDay,
  getHours,
  getMinutes,
  getSeconds,
  milliseconds,
} from "date-fns";
import countdownStyles from "./Countdown.module.css";

function Countdown(props) {
  const { step, speedCount } = props;

  const [count, setCount] = useState(endOfDay(new Date()));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setCount((prevValue) => subMilliseconds(prevValue, step));
      }, speedCount);

      if (
        milliseconds({
          hours: getHours(count),
          minutes: getMinutes(count),
          seconds: getSeconds(count),
        }) <= step
      ) {
        setIsRunning(!isRunning);
        setCount(startOfDay(count));
      }
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isRunning, count, step, speedCount]);

  if (step > 10000000) {
    return new Error("Invalid step! Must be less than 10 000 000.");
  }

  return (
    <div className={countdownStyles.wrapper}>
      <h1 className={countdownStyles.time_style}>
        {format(count, "HH:mm:ss.SSS")}
      </h1>

      <div className={countdownStyles.btn_wrap}>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "stop" : "start"}
        </button>
        <button
          onClick={() => {
            setCount(endOfDay(new Date()));
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
}

Countdown.propTypes = {
  step: PropTypes.number,
  speedCount: PropTypes.number,
};
Countdown.defaultProps = {
  step: 100,
  speedCount: 100,
};

export default Countdown;

