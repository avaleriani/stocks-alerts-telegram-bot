export const defaultState = {
  marketOpen: false,
  botRunning: false,
  lastChangePercent: 0,
  lastFiftyTwoWeek: 0,
  volume10Triggered: false,
  volume30Triggered: false,
};

const useState = defaultValue => {
  global.value = defaultValue;
  const setValue = newValue => (global.value = newValue);

  return [global.value, setValue];
};

export default useState;
