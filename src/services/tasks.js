import fetchQuote from "./ticker-data.js";
import { JOB_MANAGE_SCHEDULE } from "../utils/constants.js";

export const checkPriceFn = async bot => {
  await bot.telegram.sendMessage(process.env.CHAT_ID, "Checking price...");
  const { price } = await fetchQuote(process.env.TICKER);
  if (shouldNotify(price)) {
    const message = `Current price is: ${price}`;
    await bot.telegram.sendMessage(process.env.CHAT_ID, message);
  }
};

export const manageSchedulerFn = async (bot, scheduler) => {
  await bot.telegram.sendMessage(process.env.CHAT_ID, "Managing scheduler...");
  // Check if market is open
  const { marketState } = await fetchQuote(process.env.TICKER);
  const isMarketOpen = marketState !== "CLOSED";
  // const isMarketOpen = true; // TODO: Remove this line

  const priceJob = scheduler.getById(JOB_MANAGE_SCHEDULE);

  await bot.telegram.sendMessage(process.env.CHAT_ID, isMarketOpen ? "Market is open" : "Market is closed");

  if (isMarketOpen && priceJob && priceJob.getStatus() === "stopped") {
    await bot.telegram.sendMessage(process.env.CHAT_ID, "Starting price bot");
    priceJob.start();
  } else if (!isMarketOpen && priceJob && priceJob.getStatus() === "started") {
    await bot.telegram.sendMessage(process.env.CHAT_ID, "Stopping price bot");
    priceJob.stop();
  }
};

const shouldNotify = price => {
  return true;
};
