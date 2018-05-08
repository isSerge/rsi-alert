const { last } = require('ramda')
const { RSI }  = require('technicalindicators')
const { getClosingPrices } = require('./bittrex')
const { sendAlert } = require('./alert')
const { iterate } = require('./helpers')

const calculateRsi = async (currency, period, unit) => {
	try {
		const values = await getClosingPrices(currency, period, unit)
		const result = RSI.calculate({ values, period: 14 })
		return last(result)
	} catch (error) {
		console.log('Failed to calculate for', currency)
	}
}

const handleRsi = async ({ name }) => {
	const rsi = await calculateRsi(name, 250, 'thirtyMin')
	const condition = rsi >= 70 || rsi <= 30
	// const condition = true

	return condition
		? sendAlert({ name, rsi })
		: console.log(name, 'do nothing', rsi)
}

const handleCurrencies = currencies => iterate(handleRsi, currencies)

module.exports = {
	handleCurrencies
}