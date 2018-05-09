const R = require('ramda')
const Currency = require('../models/currency.model')

const saveCurrency = currency => new Currency(currency).save()
// todo: modify to filter only sell and buy
const getCurrencies = () => Currency.find({}).exec()
const getCurrencyNames = async () => R.pluck('name', await getCurrencies())

module.exports = {
    saveCurrency,
    getCurrencies,
    getCurrencyNames,
}
