var mongoose = require('mongoose')
var Schema = mongoose.Schema

var clinicSchema = new Schema({
	name: String,
	address:  String,
	street: String,
	street2: String,
	city: String,
	state: String,
	zip: String,
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: ['Number'],
			required: true
		}
	}, 
	description: String,
	url: String,
	hours: String,
	phone: String,
	fax: String,
	email: String
})

var Clinic = mongoose.model('Clinic', clinicSchema)

module.exports = Clinic
