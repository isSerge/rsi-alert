const config = require('config')
const mongoose = require('mongoose')
const { handleCurrencies } = require('./components/rsi')
const { getCurrencies } = require('./components/db')
const { init } = require('./components/bot')

mongoose.Promise = Promise
mongoose.connect(config.get('db.url'))
const db = mongoose.connection

const execute = async () => {
    handleCurrencies(await getCurrencies())
    setInterval(async () => handleCurrencies(await getCurrencies()), config.get('interval'))
}

db.once('open', () => {
    init()
    execute()
})
