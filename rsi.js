const { RSI }  = require('technicalindicators')
const R = require('ramda')
const { getClosingPrices } = require('./bittrex')

const calculateRsi = async (currency, period, unit) => {
	const values = await getClosingPrices(currency, period, unit)
	const result = RSI.calculate({
		values,
		period: 14
	})

	return R.last(result)
}

module.exports = {
	calculateRsi
}