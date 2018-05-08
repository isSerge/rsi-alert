const config = require('config')
const mongoose = require('mongoose')
const { handleCurrencies } = require('./components/rsi')
const { getCurrencies } = require('./components/db')

const interval = 60000

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
    const currencies = await getCurrencies()
    executeJob(currencies)
})
