export const notify = async (state, setState, quote, bot) => {
  const CHANGE_PERCENTAGE = 4;
  const {
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    regularMarketChangePercent,
    regularMarketVolume,
    averageDailyVolume10Day,
    averageDailyVolume3Month,
    regularMarketPrice,
  } = quote;

  let message = [];

  // If price increase is greater than CHANGE_PERCENTAGE OR price increased again more than CHANGE_PERCENTAGE in a day.
  if (
    regularMarketChangePercent > CHANGE_PERCENTAGE &&
    regularMarketChangePercent > state.lastChangePercent + CHANGE_PERCENTAGE
  ) {
    message.push(`Stock is going up! 📈 (${regularMarketChangePercent}%) 🚀`);
    setState({ ...state, lastChangePercent: Math.abs(state.lastChangePercent + regularMarketChangePercent) });
  }
  // If price decrease is lower than CHANGE_PERCENTAGE OR price decreased again more than CHANGE_PERCENTAGE in a day.
  if (
    regularMarketChangePercent < -CHANGE_PERCENTAGE &&
    regularMarketChangePercent < -CHANGE_PERCENTAGE + state.lastChangePercent
  ) {
    message.push(`Stock is going down! 📉 (${regularMarketChangePercent}%)`);
    setState({ ...state, lastChangePercent: -Math.abs(state.lastChangePercent + regularMarketChangePercent) });
  }
  // If Volume is higher than last 10 days.
  if (averageDailyVolume10Day < regularMarketVolume && !state.volume10Triggered) {
    message.push(`Volume has surpassed 10 day average! 📈`);
    setState({ ...state, volume10Triggered: true });
  }
  // If volume is higher than 3 months.
  if (averageDailyVolume3Month < regularMarketVolume && !state.volume30Triggered) {
    message.push(`Volume has surpassed 3 month average! 📈`);
    setState({ ...state, volume30Triggered: true });
  }
  // If price is lower than 52-week high.
  if (fiftyTwoWeekLow > regularMarketPrice && !state.lastFiftyTwoWeek) {
    message.push(`Price is lower than 52 week low! 📉`);
    setState({ ...state, lastFiftyTwoWeek: true });
  }
  // If price is higher than 52-week high.
  if (fiftyTwoWeekHigh < regularMarketPrice && !state.lastFiftyTwoWeek) {
    message.push(`⭐ Price is higher than 52 week high! 📈 ⭐`);
    setState({ ...state, lastFiftyTwoWeek: true });
  }
  // TODO: what happens if price decreased more than CHANGE_PERCENTAGE and then went up again?

  console.log({ state });
  if (message.length > 0) {
    await bot.telegram.sendMessage(process.env.CHAT_ID, message.join("\n"));
  }
};
