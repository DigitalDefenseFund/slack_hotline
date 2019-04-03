const csv = require('csv-parser')
const fs = require('fs')
const db = require('monk')(process.env.MONGO_URI || process.env.MONGODB_URI)


let clinicsList = [];

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
		let clinics = db.get('clinics')
		clinics.createIndex({"location":"2dsphere"})

		clinics.insert(clinicsList).then((insertedClinics)=>{
			console.log(`Inserted ${JSON.stringify(insertedClinics.length)} clinics`)
		}).catch((err)=>{
			console.log(err)
		}).then(() => {
			db.close()
		})
	});


