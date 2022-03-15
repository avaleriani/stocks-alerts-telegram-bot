import { setState } from "./state.js";

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

  // If price increase is greater than CHANGE_PERCENTAGE OR price increased again more than CHANGE_PERCENTAGE in a day.
  if (
    regularMarketChangePercent > CHANGE_PERCENTAGE &&
    regularMarketChangePercent > global.state.lastChangePercent + CHANGE_PERCENTAGE
  ) {
    message.push(`Stock is going up! 📈 (${regularMarketChangePercent}%) 🚀 -- Price: ${regularMarketPrice} 🚀`);
    setState({
      ...global.state,
      lastChangePercent: Math.abs(global.state.lastChangePercent + regularMarketChangePercent),
    });
  }
  // If price decrease is lower than CHANGE_PERCENTAGE OR price decreased again more than CHANGE_PERCENTAGE in a day.
  if (
    regularMarketChangePercent < -CHANGE_PERCENTAGE &&
    regularMarketChangePercent < -CHANGE_PERCENTAGE + global.state.lastChangePercent
  ) {
    message.push(`Stock is going down! 📉 (${regularMarketChangePercent}%) -- Price: ${regularMarketPrice} 💸`);
    setState({
      ...global.state,
      lastChangePercent: -Math.abs(global.state.lastChangePercent + regularMarketChangePercent),
    });
  }
  // If Volume is higher than last 10 days.
  if (averageDailyVolume10Day < regularMarketVolume && !global.state.volume10Triggered) {
    message.push(`Volume has surpassed 10 day average! 📈`);
    setState({ ...global.state, volume10Triggered: true });
  }
  // If volume is higher than 3 months.
  if (averageDailyVolume3Month < regularMarketVolume && !global.state.volume30Triggered) {
    message.push(`Volume has surpassed 3 month average! 📈🚀`);
    setState({ ...global.state, volume30Triggered: true });
  }
  // If volume is getting out of control
  if (averageDailyVolume3Month * 3 < regularMarketVolume && !global.state.volumeOocTriggered) {
    message.push(`Volume has is out of control! 🚀📈🚀 -- Volume: ${regularMarketVolume} 🚀📈🚀`);
    setState({ ...global.state, volumeOocTriggered: true });
  }
  // If price is lower than 52-week high.
  if (fiftyTwoWeekLow > regularMarketPrice && !global.state.lastFiftyTwoWeek) {
    message.push(`Price is lower than 52 week low! 💥 📉 💥 -- Price ${regularMarketPrice} 💥`);
    setState({ ...global.state, lastFiftyTwoWeek: true });
  }
  // If price is higher than 52-week high.
  if (fiftyTwoWeekHigh < regularMarketPrice && !global.state.lastFiftyTwoWeek) {
    message.push(`⭐ Price is higher than 52 week high! 📈 ⭐ 📈 -- Price ${regularMarketPrice} 📈 🚀🚀🚀🚀🚀🚀🚀🚀🚀`);
    setState({ ...global.state, lastFiftyTwoWeek: true });
  }
  // TODO: what happens if price decreased more than CHANGE_PERCENTAGE and then went up again?

  if (message.length > 0) {
    await bot.telegram.sendMessage(process.env.CHAT_ID, message.join("\n"));
  }
};
