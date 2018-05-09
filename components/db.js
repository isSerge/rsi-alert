const R = require('ramda')
const Currency = require('../models/currency.model')

const getCurrencies = () => Currency.find({}).exec()
const getCurrencyNames = async () => R.pluck('name', await getCurrencies())
const removeCurrency = name => Currency.remove({ name }).exec()
const saveCurrency = currency => new Currency(currency).save()
const updateCurrency = ({ name, sell, buy }) => Currency.updateOne({ name }, { sell, buy })

module.exports = {
    saveCurrency,
    getCurrencies,
    getCurrencyNames,
    removeCurrency,
    updateCurrency,
}
