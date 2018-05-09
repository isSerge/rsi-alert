const mongoose = require('mongoose')
const { Schema } = mongoose

const currencySchema = Schema({
    name: {
        type: String,
        required: true,
    },
    buy: {
        type: Boolean,
        required: true,
    },
    sell: {
        type: Boolean,
        required: true,
    },
})

currencySchema.pre('save', function(next) {
    const { name } = this

    currencyModel
        .find({ name })
        .exec()
        .then(docs => (!docs.length ? next() : next(new Error('currency exists!'))))
        .catch(err => next(new Error(err)))
})

const currencyModel = mongoose.model('currency', currencySchema)

module.exports = currencyModel
