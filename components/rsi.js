const { last } = require('ramda')
const { RSI } = require('technicalindicators')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./bot')
const { iterate } = require('../helpers')
const { logColored, logTime } = require('./logger')

const getRsiAndPrice = async (currency, period, unit) => {
    try {
        const values = await getClosingPrices(currency, period, unit)
        const result = RSI.calculate({ values, period: 14 })
        return {
            rsi: last(result),
            price: last(values),
        }
    } catch (error) {
        console.error('Failed to calculate for', currency)
    }
}

const processRsi = async ({ name, buy, sell }) => {
    const { rsi, price } = await getRsiAndPrice(name, 250, 'thirtyMin')
    const sellCondition = rsi >= 70 && sell
    const buyCondition = rsi <= 30 && buy
    return buyCondition || sellCondition
        ? sendAlert({ name, rsi, price })
        : logColored({ name, rsi, price })
}

const processCurrencies = currencies => {
    logTime()
    return iterate(processRsi, currencies)
}

module.exports = {
    processCurrencies,
}
