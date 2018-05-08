const TelegramBot = require('node-telegram-bot-api')
const { log } = require('../helpers')
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHAT_ID

const sendAlert = ({ name, rsi }) => {
    log({ name, rsi })
    bot.sendMessage(chatId, `${rsi >= 70 ? 'sell' : 'buy'}: ${name}, ${rsi}`)
    return console.log('Alert was sent')
}

module.exports = {
    sendAlert,
}
