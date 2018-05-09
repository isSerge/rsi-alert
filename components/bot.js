const config = require('config')
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
    bot.sendMessage(chatId, config.get('messages.commands'))

    bot.onText(/\/start/, msg => {
        const { id } = msg.from

        bot.sendMessage(id, config.get('messages.start') + config.get('messages.commands'))
    })

    bot.onText(/\/currencies/, msg => {
        const { id } = msg.from

        bot.sendMessage(id, 'your currencies:')
    })

    bot.onText(/\/add/, msg => {
        const { id } = msg.from

        bot.sendMessage(id, 'add new currency')
    })
}

module.exports = {
    sendAlert,
    init,
}
