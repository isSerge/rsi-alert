const iterateCurrencies = (handler, xs) => {
	for (const x of xs) handler(x)
}

module.exports = {
	iterateCurrencies,
}