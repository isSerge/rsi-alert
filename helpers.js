const colors = require('colors')

const iterate = (handler, xs) => {
    for (const x of xs) handler(x)
}

const logColored = ({ name, rsi }) => {
    const str = `${name}: ${rsi}`

    switch (true) {
        case rsi > 0 && rsi < 30:
            return console.log(colors.green(str))
        case rsi > 30 && rsi < 35:
            return console.log(colors.yellow(str))
        case rsi > 65 && rsi < 69:
            return console.log(colors.magenta(str))
        case rsi > 70 && rsi < 100:
            return console.log(colors.red(str))
        default:
            return console.log(colors.gray(str))
    }
}

const logTime = () => {
    console.log('-------------------------')
    console.log(new Date(Date.now()))
    console.log('-------------------------')
}

module.exports = {
    iterate,
    logColored,
    logTime,
}
