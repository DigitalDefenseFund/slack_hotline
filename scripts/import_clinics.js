var Clinic = require('../components/models/clinic')
var csv = require('csv-parser')
var fs = require('fs')
var mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
var clinicsList = [];

fs.createReadStream('clinics_title_x.csv')
	.pipe(csv())
	.on('data', (data) => {
		clinicsList.push({
			name: data.name,
			street: data.street,
			city: data.city,
			state: data.state,
			zip: data.zip,
			location: {
				type: 'Point',
				coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
			},
			contactInfo: data.contact
		})
	})
	.on('end', () => {
		console.log(`Inserting ${clinicsList.length} clinics`)
		Clinic.collection.insertMany(clinicsList, function(err, result){
			if(err){
				console.log(err)
			} else {
				console.log(`Inserted ${JSON.stringify(result.insertedCount)} clinics`)
			}
			process.exit()
		})
	});


