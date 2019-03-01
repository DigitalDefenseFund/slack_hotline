const shared = require('./shared')
const googleMaps = require('@google/maps')
const turf = require('turf')
const db = require('monk')(process.env.MONGO_URI || process.env.MONGODB_URI)
 
// const users = db.get('users')
 
// users.index('name last')
// users.insert({ name: 'Tobi', bigdata: {} })
// users.find({ name: 'Loki' }, '-bigdata').then(function () {
//   // exclude bigdata field
// })
// users.find({}, {sort: {name: 1}}).then(function () {
//   // sorted by name field
// })
// users.remove({ name: 'Loki' })
 
// db.close()


googleMapsClient = googleMaps.createClient({
  key: process.env.google_geolocation_api_key
});

const findClinic = module.exports = {}

findClinic.call = function(controller, bot, message) {
  zipCodeMatch = message.text.match('([0-9]{5})')
  if( !zipCodeMatch ){
    replyText = '```Please submit a valid zip code with /find_clinic to get nearby clinics```'
    bot.replyPublic(message, replyText)
  } else {
    zipCode = zipCodeMatch[1]
    googleMapsClient.geocode({'address': zipCode}, function(error, response) {
      if (!error) {
        lat = response.json.results[0].geometry.location.lat;
        lng = response.json.results[0].geometry.location.lng;

        const clinics = db.get('clinics')
        clinics.index({point:"2dsphere"})
        clinics.find(
          {
            'location': {
              '$near': {
                '$geometry': {
                  'type': "Point" ,
                  'coordinates': [ lng, lat]
                },
                '$maxDistance': 100000,
                '$minDistance': 0
              }
            }
          }).then(function(clinics){
            console.log('CLINICS?', clinics)
            if(!error && clinics) {
              if(clinics.length == 0){
                replyText = '```No clinics found at that zip code```';
              } else {
                replyText = messageBuilder(zipCode, lng, lat, clinics)
              }
              bot.replyPublic(message, replyText)
            }
            db.close();
          }).catch(function(err){
            console.log('ERR', err)
            db.close();
          })
      } else {
        console.log("Geocode failed: " + error);
        replyText = '```Please submit a valid zip code with /find_clinic to get nearby clinics```'
        bot.replyPublic(message, replyText)
      }
    })
  }
}

function messageBuilder(zipCode, zipLng, zipLat, clinicList){
  //botkit-storage-mongo doesnt seem to allow us to specify limit,
  // so we're limiting below
  clinicList = clinicList.length > 5 ? clinicList.slice(0, 5) : clinicList
  let message = '```We found the following clinics near zip code ' + zipCode + '\n\n'
  for(var i = 0; i < clinicList.length; i++){
    // botkit-storage-mongo doesn't let us run aggregations, 
    // which are necessary to compute distance from query point, 
    // so we calculate here. 
    distanceFromZip = turf.distance(turf.point([zipLng, zipLat]), turf.point(clinicList[i].location.coordinates), 'miles')
    message += `${distanceFromZip.toFixed(1)} miles from ${zipCode} \n`
    message += clinicList[i].name + '\n'
    message += clinicList[i].address + '\n'
    message += clinicList[i].contactInfo + '\n'
    message += '\n'
    console.log(`street ${clinicList[i].street}`)
    console.log(`city ${clinicList[i].city}`)
    console.log(`state ${clinicList[i].state}`)
    console.log(`zip ${clinicList[i].zip}`)
    console.log(`full addr wnull for street${clinicList[i].street}\n${clinicList[i].city}, ${clinicList[i].state} ${clinicList[i].zip}`)
    console.log(clinicList[i].address)
  }
  message += '```'
  return message
}
