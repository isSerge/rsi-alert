const R = require('ramda')

const iterate = R.curry(async (handler, xs) => {
    let result = []
    for (const x of xs) {
        result.push(await handler(x))
    }

    return result
})

const mapIndexed = R.addIndex(R.map)
const addNumbers = mapIndexed((x, i) => `${i + 1}. ${x}`)
const getNames = R.pluck('name')

module.exports = {
    iterate,
    addNumbers,
    getNames,
}
