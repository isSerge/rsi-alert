const R = require('ramda')

const iterate = (handler, xs) => {
    for (const x of xs) handler(x)
}

const mapIndexed = R.addIndex(R.map)
const addNumbers = mapIndexed((x, i) => `${i + 1}. ${x}`)

module.exports = {
    iterate,
    addNumbers,
}
