const config = require("config");
const bot = require("node-telegram-bot-api");
const winston = require("winston");

const api = new bot(config.get("token"), { polling: true });

api.onText(/\/help/, (msg, match) => {
  const { id } = msg.from;

  api.sendMessage(id, config.get("messages.help"));
});

api.onText(/\/start/, (msg, match) => {
  const { id } = msg.from;

  api.sendMessage(
    id,
    config.get("messages.start") + config.get("messages.commands")
  );
});


winston.info("Bot has started. Start conversations in your Telegram.");
