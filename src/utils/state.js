export const defaultState = {
  marketOpen: false,
  botRunning: false,
  lastChangePercent: 0,
  lastFiftyTwoWeek: 0,
  volume10Triggered: false,
  volume30Triggered: false,
  volumeOocTriggered: false,
};

export const setState = newValue => {
  global.state = newValue;
};
