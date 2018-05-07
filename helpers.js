const iterate = (handler, xs) => {
	for (const x of xs) handler(x)
}

module.exports = {
	iterate,
}