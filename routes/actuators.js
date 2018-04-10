// var resources = require('./../resources/model');
// var actuator, interval;
// var model = resources.pi.actuators.leds['1'];
// var pluginName = model.name;
// var localParams = {'simulate': false, 'frequency': 2000};
// var Gpio = require('onoff').Gpio;



// function switchOnOff(value) {
//     console.info('switchOnOff is called');
//     interval = setInterval(function () {

//       actuator = new Gpio(model.gpio, 'out'); 
//         actuator.write(value === true ? 1 : 0, function () { //#C
//           console.info('Changed value of %s to %s', pluginName, value);
//         });
      
//       // Switch value on a regular basis
//     }, localParams.frequency);
// }

var express = require('express'),
  router = express.Router(),
  resources = require('./../resources/model');

// router.route('/').get(function (req, res, next) {
//   req.result = resources.pi.actuators;
//   next();
// });

router.route('/leds').get(function (req, res, next) {
  req.result = resources.pi.actuators.leds;
  next();
});

//weida add valve route
router.route('/valve').get(function (req, res, next) {
  req.result = resources.pi.actuators.valve;
  next();
});

router.route('/leds/:id').get(function (req, res, next) { //#A
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put(function(req, res, next) { //#B
  var selectedLed = resources.pi.actuators.leds[req.params.id];
  selectedLed.value = req.body.value; //#C
  console.info('Changed LED %s value to %s', req.params.id, selectedLed.value);
  req.result = selectedLed;
  console.info('Inside router');
  //switchOnOff(selectedLed);
  next();
});

module.exports = router;

//#A Callback for a GET request on an LED
//#B Callback for a PUT request on an LED
//#C Update the value of the selected LED in the model


/*
//Initial version:

var express = require('express'),
router = express.Router(),
resources = require('./../resources/model');

router.route('/').get(function (req, res, next) { // #A
 res.send(resources.pi.actuators); // #B
});

router.route('/leds').get(function (req, res, next) { // #C
  res.send(resources.pi.actuators.leds);
});

router.route('/leds/:id').get(function (req, res, next) { //#D
  res.send(resources.pi.actuators.leds[req.params.id]); //#E
});

module.exports = router;

//#A Create a new route for a GET request
//#B Reply with the actuators model when this route is selected
//#C This route serves a list of LEDs
//#D with :id we inject a variable in the path which will be the LED number
//#E the path variables are accessible via req.params.id we use this to select the right object in our model and return it
*/