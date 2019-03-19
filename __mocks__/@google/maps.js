const gmaps = jest.genMockFromModule('@google/maps');

// LOCATIONS = {
//   44553: [-92.7201903, 35.1674683],
//   33322: [-35.1674683, 92.7201903]
// }

gmaps.createClient = jest.fn(() =>{
  console.log('LOCATIONS CONST?', LOCATIONS)
  let googleMapsClient = {}
  googleMapsClient.geocode = function(zip, callback) {
    let stubbedGeocodedResponse = {
      json: {
        results: [
          {
            geometry: {
              location: {
                lng: LOCATIONS[zip][0],
                lat: LOCATIONS[zip][1]
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