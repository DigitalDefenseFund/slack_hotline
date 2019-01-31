var Clinic = require('../components/models/clinic')
var csv = require('csv-parser')
var fs = require('fs')
var mongoose = require('mongoose')

console.log(`URI: ${JSON.stringify(process.env.MONGO_URI)}`)
mongoose.connect(process.env.MONGO_URI)
var clinicsList = [];

fs.createReadStream('clinics.csv')
	.pipe(csv())
	.on('data', (data) => {
		var newClinic = new Clinic({
			name: data.name,
			address: data.address,
			street: data.street,
			street2: data.street2,
			city: data.city,
			state: data.state,
			zip: data.zip,
			location: {
				type: 'Point',
				coordinates: [data.lng, data.lat]
			},
			description: data.description,
			url: data.url,
			hours: data.hours,
			phone: data.phone,
			email: data.email
		})
		newClinic.save()
			.then( (clinic) => {
			console.log(`Stored ${clinic.name}`)
			})
			.catch( (err) => {
				console.log(err)
			})
	})
	.on('end', () => {
		console.log("done");
	});


