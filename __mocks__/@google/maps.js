const gmaps = jest.genMockFromModule('@google/maps');

let stubbedGeocodedResponse = {
  json: {
    results: [
      {
        geometry: {
          location: {
            lat: 23.5209843,
            lng: 14.2343521
          }
        }
      }
    ]
  }
}

gmaps.createClient = jest.fn(() =>{
  let googleMapsClient = {}
  googleMapsClient.geocode = function(zip, callback) {
    callback(null, stubbedGeocodedResponse)
  }
  return googleMapsClient
})

module.exports = gmaps;