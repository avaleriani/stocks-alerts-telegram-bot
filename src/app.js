import "dotenv/config";
import Bot from "./services/bot.js";
import { SchedulerInit, SchedulerRunTasks } from "./services/scheduler.js";
import { checkPriceFn, manageSchedulerFn } from "./services/tasks.js";
import { JOB_MANAGE_SCHEDULE } from "./utils/constants.js";
import useState, { defaultState } from "./utils/useState.js";

const Main = async () => {
  const [state, setState] = useState(defaultState);
  // Init instance of bot and scheduler
  const bot = await Bot();
  const scheduler = SchedulerInit();

  // Define price check task function with parameters
  const priceFn = () => checkPriceFn(state, setState, bot);

  // Define manage schedule task function with parameters to control price check
  const manageSchedule = () => manageSchedulerFn(state, setState, bot, scheduler);

  // Initialize tasks on scheduler
  SchedulerRunTasks(scheduler, priceFn, manageSchedule);

  // Start scheduler task to check for market open and run tasks
  scheduler.startById(JOB_MANAGE_SCHEDULE);
};

await Main();
