export const throttle = <Arguments extends any[]>(
  callback: (...args: Arguments) => any,
  timeFrame: number,
) => {
  let lastTime = 0;
  return function (...args: Arguments) {
    const now = new Date();
    if (now.getTime() - lastTime >= timeFrame) {
      callback(...args);
      lastTime = now.getTime();
    }
  };
};
