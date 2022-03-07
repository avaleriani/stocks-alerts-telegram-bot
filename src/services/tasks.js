import fetchQuote from "./ticker-data.js";
import { JOB_CHECK_PRICE } from "../utils/constants.js";
import { shouldNotify } from "../utils/notification.js";

// Check the price of the stock every 5 minutes and decide if price change triggers a notification
export const checkPriceFn = async bot => {
  await bot.telegram.sendMessage(process.env.CHAT_ID, "Checking price...");
  const { price } = await fetchQuote(process.env.TICKER);
  if (shouldNotify(price)) {
    const isTrendingDown = price;
    const message = `Current price is: ${price} 📉📈`;
    await bot.telegram.sendMessage(process.env.CHAT_ID, message);
  }
};

// Decides if it should be running price check task because the market is open.
export const manageSchedulerFn = async (bot, scheduler) => {
  await bot.telegram.sendMessage(process.env.CHAT_ID, "Running scheduler check...");

  // Check if market is open
  const { marketState } = await fetchQuote(process.env.TICKER);
  const isMarketOpen = marketState !== "CLOSED";

  // Check if bot is already running
  const priceJob = scheduler.getById(JOB_CHECK_PRICE);
  const isBotStarted = priceJob && priceJob.getStatus() === "running";

  await bot.telegram.sendMessage(process.env.CHAT_ID, isMarketOpen ? "Market is open 🚀🚀🚀" : "Market is closed");

  if (isMarketOpen && !isBotStarted) {
    console.log("Starting price bot", isMarketOpen && isBotStarted, isMarketOpen, isBotStarted, priceJob.getStatus());
    await bot.telegram.sendMessage(process.env.CHAT_ID, "Starting price check...");
    priceJob.start();
  } else if (!isMarketOpen && isBotStarted) {
    await bot.telegram.sendMessage(process.env.CHAT_ID, "Stopping price check...");
    priceJob.stop();
  }
};
