import { Telegraf } from "telegraf";

// LAUNCH BOT
const Bot = async () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.on("message", async ctx => {
    await ctx.telegram.sendMessage(ctx.chat.id, "OK");
  });

  await bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
};

export default Bot;
