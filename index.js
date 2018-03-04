const { calculateRSI } = require('./helpers')

calculateRSI('ETH', 14, 'hour')
	.then(r => console.log('RSI', r))
