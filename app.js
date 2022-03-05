import { Telegraf } from "telegraf";
import "dotenv";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", ctx => {
  // Explicit usage
  ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
