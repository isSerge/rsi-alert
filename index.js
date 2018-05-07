const { RSI }  = require('technicalindicators')
const { getClosingPrices } = require('./helpers')

const calculate = async (currency, period, unit) => {
	const values = await getClosingPrices(currency, period, unit)

	const result = RSI.calculate({
		values,
		period: 14
	})

	console.log(result[result.length - 1])
}

calculate('ETH', 250, 'thirtyMin')

