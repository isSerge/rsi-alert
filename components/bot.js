require('dotenv').config()
const R = require('ramda')
const config = require('config')
const TelegramBot = require('node-telegram-bot-api')
const { logColored } = require('./logger')
const {
    getCurrencies,
    getBuyCurrencies,
    getSellCurrencies,
    removeCurrency,
    saveCurrency,
    updateCurrency,
} = require('./db')
const { getMarketNames } = require('./bittrex')
const { addNumbers, getNames } = require('../helpers')
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHAT_ID

const sendAlert = ({ name, rsi }) => {
    logColored({ name, rsi })
    bot.sendMessage(chatId, `${rsi >= 70 ? 'sell' : 'buy'}: ${name}, ${rsi}`)
}

const handleStart = msg => {
    const { id } = msg.from
    bot.sendMessage(id, config.get('messages.start') + config.get('messages.commands'))
}

const handlePing = msg => {
    const { id } = msg.from
    bot.sendMessage(id, 'I am alive')
}

const handleHelp = msg => {
    const { id } = msg.from
    bot.sendMessage(id, 'Commands and descriptions will be here')
}

const handleCurrencies = async msg => {
    const { id } = msg.from
    const buy = getNames(await getBuyCurrencies())
    const sell = getNames(await getSellCurrencies())
    bot.sendMessage(id, `selected currencies to buy: \n${addNumbers(buy).join('\n')}`)
    bot.sendMessage(id, `selected currencies to sell: \n${addNumbers(sell).join('\n')}`)
}

const handleAdd = async (msg, match) => {
    const { id } = msg.from
    const [name, ...actions] = match[1].split(' ')
    const sell = R.contains('sell', actions)
    const buy = R.contains('buy', actions)

    const currencies = await getMarketNames()

    if (!R.contains(name, currencies)) {
        return bot.sendMessage(id, `Currency is not listed on Bittrex: ${name}`)
    }

    try {
        await saveCurrency({ name, sell, buy })
        bot.sendMessage(id, `Added new currency: ${name}, sell: ${sell}, buy: ${buy}`)
    } catch (error) {
        bot.sendMessage(id, `${error}`)
    }
}

const handleUpdate = async (msg, match) => {
    const { id } = msg.from
    const [name, ...actions] = match[1].split(' ')
    const sell = R.contains('sell', actions)
    const buy = R.contains('buy', actions)
    const currencies = getNames(await getCurrencies())

    if (R.contains(name, currencies)) {
        await updateCurrency({ name, sell, buy })
        bot.sendMessage(id, `Currency updated: ${name}, sell: ${sell}, buy: ${buy}`)
    } else {
        bot.sendMessage(id, `Currency is not in the list: ${name}`)
    }
}

const handleRemove = async (msg, match) => {
    const { id } = msg.from
    const name = match[1]
    const currencies = getNames(await getCurrencies())

    if (R.contains(name, currencies)) {
        await removeCurrency(name)
        bot.sendMessage(id, `Currency was removed: ${name}`)
    } else {
        bot.sendMessage(id, `Currency is not in the list: ${name}`)
    }
}

const init = () => {
    bot.sendMessage(chatId, config.get('messages.commands'))
    bot.onText(/\/start/, handleStart)
    bot.onText(/\/ping/, handlePing)
    bot.onText(/\/help/, handleHelp)
    bot.onText(/\/currencies/, handleCurrencies)
    bot.onText(/\/add (.+)/, handleAdd)
    bot.onText(/\/update (.+)/, handleUpdate)
    bot.onText(/\/remove (.+)/, handleRemove)
}

module.exports = {
    sendAlert,
    init,
}
