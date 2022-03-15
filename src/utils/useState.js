export const defaultState = {
  marketOpen: false,
  botRunning: false,
  lastChangePercent: 0,
  lastFiftyTwoWeek: 0,
  volume10Triggered: false,
  volume30Triggered: false,
};

const useState = defaultValue => {
  let value = defaultValue;
  const setValue = newValue => (value = newValue);
  return [value, setValue];
};

export default useState;
