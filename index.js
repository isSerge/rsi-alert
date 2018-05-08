const config = require('config')
const mongoose = require('mongoose')
const { handleCurrencies } = require('./components/rsi')
const { saveCurrency, getCurrencies } = require('./components/db')

const interval = 15000

// const currencies = [
// 	{ name: 'eth' },
// 	{ name: 'ada' },
// 	{ name: 'neo', sell: true, buy: false },
// 	{ name: 'bcc' },
// 	{ name: 'xvg' },
// 	{ name: 'xrp' },
// 	{ name: 'ltc' },
// 	{ name: 'omg' },
// 	{ name: 'zec' },
// 	{ name: 'xmr' },
// 	{ name: 'zrx' },
// 	{ name: 'dash' },
// 	{ name: 'waves' },
// 	{ name: 'eng' },
// ]

const executeJob = currencies => {
    handleCurrencies(currencies)
    setInterval(() => handleCurrencies(currencies), interval)
}

const dbUrl = config.get('db.url')
mongoose.Promise = Promise
mongoose.connect(dbUrl)
const db = mongoose.connection

db.once('open', async () => {
    console.log('Database connection established')
    // currencies.forEach(async x => await saveCurrency(x))
    const currencies = await getCurrencies()
    executeJob(currencies)
})
