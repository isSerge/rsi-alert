const { last } = require('ramda')
const { RSI } = require('technicalindicators')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./bot')
const { iterate } = require('../helpers')
const { logColored, logTime } = require('./logger')

const calculateRsi = async (currency, period, unit) => {
    try {
        const values = await getClosingPrices(currency, period, unit)
        const result = RSI.calculate({ values, period: 14 })
        return last(result)
    } catch (error) {
        console.log('Failed to calculate for', currency)
    }
}

const processRsi = async ({ name, buy, sell }) => {
    const rsi = await calculateRsi(name, 250, 'thirtyMin')
    const sellCondition = rsi >= 70 && sell
    const buyCondition = rsi <= 30 && buy
    return buyCondition || sellCondition ? sendAlert({ name, rsi }) : logColored({ name, rsi })
}

const handleCurrencies = currencies => {
    logTime()
    return iterate(processRsi, currencies)
}

module.exports = {
    handleCurrencies,
}
