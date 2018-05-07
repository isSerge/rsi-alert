const sendAlert = ({ currency, rsi }) =>
	console.log(currency, 'send notification', rsi)

module.exports = {
	sendAlert,
}