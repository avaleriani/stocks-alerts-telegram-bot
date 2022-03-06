import "dotenv/config";
import Bot from "./services/bot.js";
import { SchedulerInit, SchedulerRunTasks } from "./services/scheduler.js";
import { checkPriceFn, manageSchedulerFn } from "./services/tasks.js";

const Main = async () => {
  const bot = await Bot();
  const scheduler = await SchedulerInit();

  const priceFn = () => checkPriceFn(bot);

  const manageSchedule = () => manageSchedulerFn(bot, scheduler);

  await SchedulerRunTasks(scheduler, priceFn, manageSchedule);
};

await Main();
