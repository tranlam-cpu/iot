const mongoose = require('mongoose');
const Schema = mongoose.Schema

const esp32Schema = new Schema({
	id: {
		type: Schema.Types.ObjectId
	},
	nhietdo: {
		type: Number,
		required: true,
	},
	doam: {
		type: Number,
		required: true,
	},
	mua: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
	
})

module.exports = mongoose.model('esp32',esp32Schema)