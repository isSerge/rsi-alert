const axios = require('axios')
const config = require('config')
const querystring = require('querystring')
const R = require('ramda')
const uri = config.get('bittrex.uri')

const getClosingPrices = async (currency = 'ETH', period = 250, tickInterval = 'thirtyMin') => {
  const ticks = await getTicks(currency, tickInterval)
  const { result = [] } = ticks.data

  return R.pluck('C', R.takeLast(period, result))
}

const getTicks = (currency, tickInterval) => {
  const marketName = `BTC-${currency}`
  const pathname = '/api/v2.0//pub/market/GetTicks'
  const q = querystring.stringify({ marketName, tickInterval })
  const url = `${uri}${pathname}?${q}`

  return axios({
    method: 'get',
    url,
    responseType: 'json',
  })
}

module.exports = {
  getClosingPrices
}