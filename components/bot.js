const R = require('ramda')
const config = require('config')
const TelegramBot = require('node-telegram-bot-api')
const { logColored } = require('./logger')
const { getCurrencyNames, saveCurrency } = require('./db')
const { addNumbers } = require('../helpers')
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

    bot.onText(/\/ping/, msg => {
        const { id } = msg.from
        bot.sendMessage(id, 'I am alive')
    })

    bot.onText(/\/help/, msg => {
        const { id } = msg.from
        bot.sendMessage(id, 'Commands and descriptions will be here')
    })

    bot.onText(/\/currencies/, async msg => {
        const { id } = msg.from
        const currencies = await getCurrencyNames()
        bot.sendMessage(id, `selected currencies: \n${addNumbers(currencies).join('\n')}`)
    })

    bot.onText(/\/add (.+)/, async (msg, match) => {
        const { id } = msg.from
        const [name, ...actions] = match[1].split(' ')
        const sell = R.contains('sell', actions)
        const buy = R.contains('buy', actions)

        try {
            await saveCurrency({ name, sell, buy })
            bot.sendMessage(id, `Added new currency: ${name}, sell: ${sell}, buy: ${buy}`)
        } catch (error) {
            bot.sendMessage(id, `${error}`)
        }
    })
}

module.exports = {
    sendAlert,
    init,
}
