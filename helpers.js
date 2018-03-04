const axios = require('axios')
const config = require('config')
const querystring = require('querystring')
const R = require('ramda')
const uri = config.get('bittrex.uri')

const calculateRSI = async (currency = 'ETH', period = 5, unit = 'hour') => {
  console.log(currency, period, unit)
  try {
    const closingPrices = await getClosingPrices(currency, period, unit);

    let count = 0;
    const change = [];

    // Calculating price changes
    for (const i of closingPrices) {
      if (count !== 0) {
        change.push(i - closingPrices[count - 1]);
      }
      count += 1;
      if (count === 15) {
        break;
      }
    }

    // Calculating gains and losses
    const advances = change.filter(c => c > 0);
    const declines = change.filter(c => c < 0).map(c => Math.abs(c));

    const averageGain = advances.length > 0 ? advances.reduce((total, x) => total + x) / 14 : 0;
    const averageLoss = declines.length > 0 ? declines.reduce((total, x) => total + x) / 14 : 0;
    let newAvgGain = averageGain;
    let newAvgLoss = averageLoss;
    for (const i of closingPrices) {
      if (count > 14 && count < closingPrices.length) {
        const close = closingPrices[count];
        const newChange = close - closingPrices[count - 1];
        let addLoss = 0;
        let addGain = 0;
        if (newChange > 0) addGain = newChange;
        if (newChange < 0) {
          addLoss = Math.abs(newChange);
          newAvgGain = (newAvgGain * 13 + addGain) / 14;
          newAvgLoss = (newAvgLoss * 13 + addLoss) / 14;
          count += 1;
        }
      }
    }

    const rs = newAvgGain / newAvgLoss;
    const newRS = 100 - 100 / (1 + rs);
    return newRS;
  } catch (err) {
    throw err;
  }
}

const getClosingPrices = async (currency = 'ETH', period = 14, unit = 'thirtyMin') => {
  console.log(currency, period, unit)
  const ticks = await getTicks(currency, unit)
  const { result = [] } = ticks.data

  return R.pluck('C', R.takeLast(period, result))
}

const getTicks = (currency, unit) => {
  const pathname = '/api/v2.0//pub/market/GetTicks'
  const options = {
    marketName: `BTC-${currency}`,
    tickInterval: unit,
  }

  return request(pathname, options)
}

const request = (pathname, options) => {
  const q = querystring.stringify(options)
  const url = `${uri}${pathname}?${q}`

  return axios({
    method: 'get',
    url,
    responseType: 'json',
  })
}

module.exports = {
  calculateRSI
}