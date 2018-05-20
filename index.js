require('dotenv').config()
const config = require('config')
const mongoose = require('mongoose')
const { processCurrencies, processSummary } = require('./components/rsi')
const { getCurrencies } = require('./components/db')
const { init } = require('./components/bot')

mongoose.Promise = Promise
mongoose.connect(process.env.DB_CONN)
const db = mongoose.connection

const execute = async () => {
    await processCurrencies(await getCurrencies())
    setInterval(async () => await processCurrencies(await getCurrencies()), config.get('interval'))
    setInterval(async () => processSummary(await getCurrencies()), config.get('summaryInterval'))
}

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    init()
    execute()
})
