const { last } = require('ramda')
const { RSI } = require('technicalindicators')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./bot')
const { iterate } = require('../helpers')
const { logColored, logTime } = require('./logger')
const R = require('ramda')

const getRsiAndPrice = async (currency, period, unit) => {
    try {
        const { name, longName, sell, buy } = currency
        const values = await getClosingPrices(name, period, unit)
        const result = RSI.calculate({ values, period: 14 })
        return {
            name,
            longName,
            sell,
            buy,
            rsi: last(result),
            price: last(values),
        }
    } catch (error) {
        console.error('Failed to calculate for', currency)
    }
}

const getCurrenciesWithRsi = iterate(async x => await getRsiAndPrice(x, 250, 'thirtyMin'))

const filteredCurrencies = R.filter(x => {
    const sellCondition = x.rsi >= 70 && x.sell
    const buyCondition = x.rsi <= 30 && x.buy
    return sellCondition || buyCondition
})

const processSummary = async xs => {
    const currencies = await getCurrenciesWithRsi(xs)
    return sendAlert(currencies)
}

const processCurrencies = async xs => {
    const currencies = await getCurrenciesWithRsi(xs)
    logTime()
    R.forEach(logColored)(currencies)
    const filtered = filteredCurrencies(currencies)
    return filtered.length > 0 && sendAlert(filtered)
}

module.exports = {
    processCurrencies,
    processSummary,
}
