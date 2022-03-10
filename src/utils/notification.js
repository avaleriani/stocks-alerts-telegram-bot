import { state, setState } from "./state.js";

export const notify = async (quote, bot) => {
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
  if (regularMarketChangePercent > CHANGE_PERCENTAGE && state.lastChangePercent > CHANGE_PERCENTAGE) {
    message.push(`Stock is going up! 📈 (+ ${regularMarketChangePercent})% 🚀`);
    setState({ lastChangePercent: regularMarketChangePercent });
  }
  if (regularMarketChangePercent < CHANGE_PERCENTAGE && state.lastChangePercent < CHANGE_PERCENTAGE) {
    message.push(`Stock is going down! 📉 (- ${regularMarketChangePercent})%`);
    setState({ lastChangePercent: regularMarketChangePercent });
  }
  if (averageDailyVolume10Day < regularMarketVolume && !state.volume10Triggered) {
    message.push(`Volume has surpassed 10 day average! 📈`);
    setState({ volume10Triggered: true });
  }
  if (averageDailyVolume3Month < regularMarketVolume && !state.volume30Triggered) {
    message.push(`Volume has surpassed 3 month average! 📈`);
    setState({ volume30Triggered: true });
  }
  if (fiftyTwoWeekLow > regularMarketPrice && !state.lastFiftyTwoWeek) {
    message.push(`Price is lower than 52 week low! 📉`);
    setState({ lastFiftyTwoWeek: true });
  }
  if (fiftyTwoWeekHigh > regularMarketPrice && !state.lastFiftyTwoWeek) {
    message.push(`⭐ Price is higher than 52 week high! 📈 ⭐`);
    setState({ lastFiftyTwoWeek: true });
  }

  if (message.length > 0) {
    await bot.telegram.sendMessage(process.env.CHAT_ID, message.join("\n"));
  }
};
