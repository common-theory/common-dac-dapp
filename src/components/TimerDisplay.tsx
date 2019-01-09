import React from 'react';

export default class TimerDisplay extends React.Component <{
  seconds: number
}> {
  static formatSeconds = (seconds: number): string => {
    const SECONDS_PER_MINUTE = 60;
    const SECONDS_PER_HOUR = 60 * 60;
    const SECONDS_PER_DAY = 60 * 60 * 24;
    if (seconds < SECONDS_PER_MINUTE) {
      return `${seconds} second${seconds === 1 ? '' : 's'}`;
    } else if (seconds >= SECONDS_PER_MINUTE && seconds < SECONDS_PER_HOUR) {
      const minutes = Math.round(seconds / SECONDS_PER_MINUTE);
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (seconds >= SECONDS_PER_HOUR && seconds < SECONDS_PER_DAY) {
      const hours = Math.round(seconds / SECONDS_PER_HOUR);
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (seconds >= SECONDS_PER_DAY) {
      const days = Math.round(seconds / SECONDS_PER_DAY);
      return `${days} day${days === 1 ? '' : 's'}`;
    }
  };

  render() {
    return (
      <>
        {TimerDisplay.formatSeconds(this.props.seconds)}
      </>
    );
  }
}
