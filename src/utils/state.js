export const state = {
  marketOpen: false,
  botRunning: false,
  lastChangePercent: 0,
  lastFiftyTwoWeek: 0,
  volume10Triggered: false,
  volume30Triggered: false,
};

export const setState = (state, value) => {
  Object.assign(state, value);
};
