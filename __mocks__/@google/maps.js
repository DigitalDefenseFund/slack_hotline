const gmaps = jest.genMockFromModule('@google/maps');
const LOCATIONS = require('../../tests/fixtures/locations.json')

gmaps.createClient = jest.fn((keyPlaceHolder) =>{
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
    callback(null, stubbedGeocodedResponse)
  }
  return googleMapsClient
})

module.exports = gmaps;
