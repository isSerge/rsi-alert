const { calculateRsi } = require('./rsi')
const { iterateCurrencies } = require('./helpers')
const { sendAlert } = require('./alert')

const handleCurrencyRsi = async currency => {
	const rsi = await calculateRsi(currency, 250, 'thirtyMin')
	// const condition = rsi >= 70 && rsi <= 30
	const condition = true

	return condition
		? sendAlert({ currency, rsi })
		: console.log(currency, 'do nothing', rsi)
}

const run = currencies => {
	iterateCurrencies(handleCurrencyRsi, currencies)
	setInterval(() => iterateCurrencies(handleCurrencyRsi, currencies), 15000)
}

const currencies = [
	'eth',
	'ada',
	'neo',
]

run(currencies)