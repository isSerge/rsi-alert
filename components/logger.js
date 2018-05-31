const colors = require('colors')
const moment = require('moment')

const logColored = ({ name, longName, rsi, price }) => {
    const str = `${longName} (${name}): ${rsi}, ${price}`

    switch (true) {
        case rsi > 0 && rsi < 30:
            return console.log(colors.green(str))
        case rsi > 30 && rsi < 40:
            return console.log(colors.yellow(str))
        case rsi > 60 && rsi < 70:
            return console.log(colors.magenta(str))
        case rsi > 70 && rsi < 100:
            return console.log(colors.red(str))
        default:
            return console.log(colors.gray(str))
    }
}

const logTime = () => {
    console.log('-------------------------')
    console.log(moment(moment()).format('MMMM Do, hh:mm a'))
    console.log('-------------------------')
}

module.exports = {
    logColored,
    logTime,
}
