const Currency = require('./models/currency.model')

const saveCurrency = currency => new Currency(currency).save()
// todo: modify to filter only sell and buy
const getCurrencies = () => Currency.find({}).exec()

module.exports = {
    saveCurrency,
    getCurrencies,
}
