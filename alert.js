const sendAlert = ({ name, rsi }) =>
	console.log(name, 'SEND NOTIFICATION', rsi)

module.exports = {
	sendAlert,
}