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
  const getValue = () => value;
  const setValue = newValue => (value = newValue);
  return [getValue, setValue];
};

export default useState;
