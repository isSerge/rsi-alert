const sendAlert = ({ name, rsi }) =>
	console.log(name, 'send notification', rsi)

module.exports = {
	sendAlert,
}