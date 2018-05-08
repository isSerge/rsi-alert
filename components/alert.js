const sendAlert = ({ name, rsi }) =>
    rsi >= 70
        ? console.log(name, 'SEND SELL NOTIFICATION', rsi)
        : console.log(name, 'SEND BUY NOTIFICATION', rsi)

module.exports = {
    sendAlert,
}
