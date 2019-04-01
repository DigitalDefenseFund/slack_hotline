const gmaps = jest.genMockFromModule('@google/maps');
const LOCATIONS = require('../../tests/fixtures/locations.json')


// LOCATIONS = {
//   44553: [-92.7201903, 35.1674683],
//   33322: [-35.1674683, 92.7201903]
// }

gmaps.createClient = jest.fn((keyPlaceHolder) =>{
  console.log('LOCATIONS CONST?', LOCATIONS)

  console.log(JSON.stringify(LOCATIONS["72110"]))
  let googleMapsClient = {}
  googleMapsClient.geocode = function(input, callback) {
    let stubbedGeocodedResponse = {
      json: {
        results: [
          {
            geometry: {
              location: {
                lat: LOCATIONS[input['address']]['lat'],
                lng: LOCATIONS[input['address']]['lng']
              }
            }
          }
        ]
      }
    }
    console.log(JSON.stringify(stubbedGeocodedResponse))
    callback(null, stubbedGeocodedResponse)
  }
  return googleMapsClient
})

module.exports = gmaps;
