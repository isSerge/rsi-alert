const { last, filter, forEach } = require('ramda')
const { RSI } = require('technicalindicators')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./bot')
const { iterate } = require('../helpers')
const { logColored, logTime } = require('./logger')

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
        console.error(`Failed to calculate for ${currency.name}: `, error)
    }
}

const getCurrenciesWithRsi = iterate(async x => {
    try {
        return await getRsiAndPrice(x, 250, 'thirtyMin')
    } catch (error) {
        console.error('Failed to get currencies with RSI: ', error)
    }
})

const filteredCurrencies = filter(x => {
    const sellCondition = x.rsi >= 70 && x.sell
    const buyCondition = x.rsi <= 30 && x.buy
    return sellCondition || buyCondition
})

const processSummary = async xs => {
    try {
        const currencies = await getCurrenciesWithRsi(xs)
        return sendAlert(currencies)
    } catch (error) {
        console.error('Failed to process summary: ', error)
    }
}

const processCurrencies = async xs => {
    try {
        const currencies = await getCurrenciesWithRsi(xs)
        logTime()
        forEach(logColored)(currencies)
        const filtered = filteredCurrencies(currencies)
        return filtered.length > 0 && sendAlert(filtered)
    } catch (error) {
        console.error('Failed to process currencies: ', error)
    }
}

module.exports = {
    processCurrencies,
    processSummary,
}
