import { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } from "toad-scheduler";
import { JOB_CHECK_PRICE, JOB_MANAGE_SCHEDULE } from "../utils/constants.js";

export const SchedulerInit = () => {
  return new ToadScheduler();
};

export const SchedulerRunTasks = (scheduler, checkPriceFn, manageSchedulerFn) => {
  const taskCheckPrice = new AsyncTask("check-price-task", checkPriceFn, err => {
    console.error("Error in taskCheckPrice", err);
  });

  const taskManageSchedule = new AsyncTask("manage-schedule-task", manageSchedulerFn, err => {
    console.error("Error in taskManageSchedule", err);
  });

  // EVERY 5 SECONDS
  const checkPrice = new SimpleIntervalJob({ seconds: 20, runImmediately: true }, taskCheckPrice, JOB_MANAGE_SCHEDULE);

  // EVERY ONE MINUTE
  const manageSchedule = new SimpleIntervalJob(
    { minutes: 1, runImmediately: true },
    taskManageSchedule,
    JOB_CHECK_PRICE,
  );

  //create and start jobs
  scheduler.addSimpleIntervalJob(manageSchedule);
  scheduler.addSimpleIntervalJob(checkPrice);
};
