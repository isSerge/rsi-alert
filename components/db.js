const Currency = require('../models/currency.model')

const getCurrencies = () => Currency.find({}).exec()
const getBuyCurrencies = () => Currency.find({ buy: true }).exec()
const getSellCurrencies = () => Currency.find({ sell: true }).exec()
const removeCurrency = name => Currency.remove({ name }).exec()
const saveCurrency = currency => new Currency(currency).save()
const updateCurrency = ({ name, sell, buy }) => Currency.updateOne({ name }, { sell, buy })

module.exports = {
    saveCurrency,
    getCurrencies,
    getBuyCurrencies,
    getSellCurrencies,
    removeCurrency,
    updateCurrency,
}
