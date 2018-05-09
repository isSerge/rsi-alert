const TelegramBot = require('node-telegram-bot-api')
const { logColored } = require('./logger')
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHAT_ID

const sendAlert = ({ name, rsi }) => {
    logColored({ name, rsi })
    bot.sendMessage(chatId, `${rsi >= 70 ? 'sell' : 'buy'}: ${name}, ${rsi}`)
    console.log('Alert was sent')
}

const init = () => {
    bot.sendMessage(chatId, 'Init')

    bot.on('message', msg => {
        // const chatId = msg.chat.id
        bot.sendMessage(chatId, 'SHTOOO')
    })
}

module.exports = {
    sendAlert,
    init,
}
