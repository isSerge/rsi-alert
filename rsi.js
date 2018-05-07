const { RSI }  = require('technicalindicators')
const R = require('ramda')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./alert')
const { iterate } = require('./helpers')

const calculateRsi = async (currency, period, unit) => {
	const values = await getClosingPrices(currency, period, unit)
	const result = RSI.calculate({ values, period: 14 })
	return R.last(result)
}

const handleRsi = async ({ name }) => {
	const rsi = await calculateRsi(name, 250, 'thirtyMin')
	const condition = rsi >= 70 || rsi <= 30
	// const condition = true

	return condition
		? sendAlert({ name, rsi })
		: console.log(name, 'do nothing', rsi)
}

const handleCurrencies = currencies =>
	iterate(handleRsi, currencies)

module.exports = {
	handleCurrencies
}