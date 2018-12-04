module.exports = function(request, response) {
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  twiml.say({ voice: 'alice' }, 'Hello! You have reached the Digital Defense Fund demo hotline for the Pigeon app. This is currently a text-only hotline. Please hang up, and text 650-753-5035.');

  // You can host an audio recording in twilio assets!
  // Note -- items hosted in Twilio assets and accessible via URL are public
  // Twilio also has its own cloud functions type of service.
  // Private assets are only accessible in functions.

  // twiml.play('https://urobilin-fox-4287.twil.io/assets/voice_mail_recording_audio.mp4.m4a');
  // ^^ Note -- the above errors out due to the file type. Having a helluva time geting a straigh
  // .mp4 audio file. MAC coerces it to video mp4 or makes you use m4a

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
}