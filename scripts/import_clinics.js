const csv = require('csv-parser')
const fs = require('fs')
const db = require('monk')(process.env.MONGO_URI || process.env.MONGODB_URI)


let clinicsList = [];
lastRow = null
fs.createReadStream('clinics_title_x.csv')
	.pipe(csv({quote: '"', escape:'"'}))
	.on('data', (data) => {
		if(data.name == null && counter == 0) {
			console.log("Row failed: " + lastRow)
		}
		lastRow = data
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
			contactInfo: data.phone
		})
	})
	.on('end', () => {
		console.log(`Inserting ${clinicsList.length} clinics`)
		let clinics = db.get('clinics')
		clinics.createIndex({"location":"2dsphere"})

		clinics.insert(clinicsList).then((insertedClinics)=>{
			console.log(`Inserted ${JSON.stringify(insertedClinics.length)} clinics`)
		}).catch((err)=>{
			console.log(err.toString())
		}).then(() => {
			db.close()
		})
	});


