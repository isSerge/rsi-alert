const { handleCurrencies } = require('./rsi')
const interval = 15000

// todo: implement
const getCurrenciesFromDB = () => ([
	{ name: 'eth' },
	{ name: 'ada' },
	{ name: 'neo' },
])

const executeJob = currencies => {
	handleCurrencies(currencies)
	setInterval(() => handleCurrencies(currencies), interval)
}

executeJob(getCurrenciesFromDB())