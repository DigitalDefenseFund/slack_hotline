var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.set('debug', true)

var clinicSchema = new Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: ['Number'],
      required: true
    }
  }, 
  contactInfo: String
})

clinicSchema.index({"location": "2dsphere"})

var virtual = clinicSchema.virtual('address')
virtual.get(function() {
  address = `${this.street}\n${this.city}, ${this.state} ${this.zip}`
  console.log("address : " + address)
  return address
})

var Clinic = mongoose.model('Clinic', clinicSchema)

module.exports = Clinic
