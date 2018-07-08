export default (() => {

  const events = {};

  const on = (eventName, fn) => {
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push(fn);
    return fn;
  };

  const off = (eventName, fn) => {
    if (!events[eventName]) return;
    events[eventName].map(callback => callback !== fn);
  };

  const call = (eventName, args) => {
    if (!events[eventName]) return;
    events[eventName].forEach(fn => fn(args));
  };

  return { on, off, call };
})();
