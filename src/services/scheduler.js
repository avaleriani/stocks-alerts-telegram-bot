import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { JOB_CHECK_PRICE, JOB_MANAGE_SCHEDULE } from "../utils/constants.js";

export const SchedulerInit = () => {
  return new ToadScheduler();
};

export const SchedulerRunTasks = (scheduler, checkPriceFn, manageSchedulerFn) => {
  // Define tasks
  const taskCheckPrice = new AsyncTask("check-price-task", checkPriceFn, err => {
    console.error("Error in taskCheckPrice", err);
  });

  const taskManageSchedule = new AsyncTask("manage-schedule-task", manageSchedulerFn, err => {
    console.error("Error in taskManageSchedule", err);
  });

  // EVERY 5 SECONDS
  const checkPrice = new SimpleIntervalJob({ seconds: 5 }, taskCheckPrice, JOB_CHECK_PRICE);

  // EVERY ONE MINUTE
  const manageSchedule = new SimpleIntervalJob({ minutes: 1 }, taskManageSchedule, JOB_MANAGE_SCHEDULE);

  //create and start jobs
  scheduler.addSimpleIntervalJob(manageSchedule);
  scheduler.addSimpleIntervalJob(checkPrice);

  // stop all the tasks, will be managed by the scheduler.
  scheduler.stop();

  // Bind stopping all scheduler tasks to the process exit event
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(eventType => {
    process.on(eventType, () => {
      scheduler.stop();
    });
  });
};
