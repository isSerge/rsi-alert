const mongoose = require('mongoose')
const { Schema } = mongoose

const currencySchema = Schema({
	name: {
		type: String,
		required: true
	},
	buy: {
		type: Boolean,
		default: true
	},
	sell: {
		type: Boolean,
		default: false
	},
})

currencySchema.pre('save', function (next) {
	const { currency } = this

	currencyModel
		.find({ currency })
		.exec()
		.then(docs => !docs.length ? next() : next(new Error('currency exists!')))
		.catch(err => next(new Error(err)))
})

const currencyModel = mongoose.model('currency', currencySchema)

module.exports = currencyModel