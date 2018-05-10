const config = require('config')
const mongoose = require('mongoose')
const { processCurrencies } = require('./components/rsi')
const { getCurrencies } = require('./components/db')
const { init } = require('./components/bot')

mongoose.Promise = Promise
mongoose.connect(config.get('db.url'))
const db = mongoose.connection

const execute = async () => {
    processCurrencies(await getCurrencies())
    setInterval(async () => processCurrencies(await getCurrencies()), config.get('interval'))
}

db.once('open', () => {
    init()
    execute()
})
