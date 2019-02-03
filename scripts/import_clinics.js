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
		clinicsList.push({
			name: data.name,
			address: data.address,
			street: data.street,
			street2: data.street2,
			city: data.city,
			state: data.state,
			zip: data.zip,
			location: {
				type: 'Point',
				coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
			},
			description: data.description,
			url: data.url,
			hours: data.hours,
			phone: data.phone,
			email: data.email
		})
	})
	.on('end', () => {
		console.log(`Inserting ${clinicsList.length} clinics`)
		Clinic.collection.insertMany(clinicsList)
			.then( (result) => {
				console.log(`Inserted ${JSON.stringify(result.insertedCount)} clinics`)
				process.exit()
			})
			.catch( (err) => {
				console.log(err)
				process.exit(1)
			})
	});


