import { setState } from "./state.js";

export const notify = async (currentState, quote, bot) => {
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
    regularMarketChangePercent > currentState.lastChangePercent + CHANGE_PERCENTAGE
  ) {
    message.push(`Stock is going up! 📈 (${regularMarketChangePercent}%) 🚀`);
    setState(currentState, {
      lastChangePercent: Math.abs(currentState.lastChangePercent + regularMarketChangePercent),
    });
  }
  // If price decrease is lower than CHANGE_PERCENTAGE OR price decreased again more than CHANGE_PERCENTAGE in a day.
  if (
    regularMarketChangePercent < -CHANGE_PERCENTAGE &&
    regularMarketChangePercent < -CHANGE_PERCENTAGE + currentState.lastChangePercent
  ) {
    message.push(`Stock is going down! 📉 (${regularMarketChangePercent}%)`);
    setState(currentState, {
      lastChangePercent: -Math.abs(currentState.lastChangePercent + regularMarketChangePercent),
    });
  }
  // If Volume is higher than last 10 days.
  if (averageDailyVolume10Day < regularMarketVolume && !currentState.volume10Triggered) {
    message.push(`Volume has surpassed 10 day average! 📈`);
    setState(currentState, { volume10Triggered: true });
  }
  // If volume is higher than 3 months.
  if (averageDailyVolume3Month < regularMarketVolume && !currentState.volume30Triggered) {
    message.push(`Volume has surpassed 3 month average! 📈`);
    setState(currentState, { volume30Triggered: true });
  }
  // If price is lower than 52-week high.
  if (fiftyTwoWeekLow > regularMarketPrice && !currentState.lastFiftyTwoWeek) {
    message.push(`Price is lower than 52 week low! 📉`);
    setState(currentState, { lastFiftyTwoWeek: true });
  }
  // If price is higher than 52-week high.
  if (fiftyTwoWeekHigh < regularMarketPrice && !currentState.lastFiftyTwoWeek) {
    message.push(`⭐ Price is higher than 52 week high! 📈 ⭐`);
    setState(currentState, { lastFiftyTwoWeek: true });
  }
  // TODO: what happens if price decreased more than CHANGE_PERCENTAGE and then went up again?

  if (message.length > 0) {
    await bot.telegram.sendMessage(process.env.CHAT_ID, message.join("\n"));
  }
};
