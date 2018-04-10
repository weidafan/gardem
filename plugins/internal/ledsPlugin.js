var resources = require('./../../resources/model');

var actuator, interval;
var model = resources.pi.actuators.leds;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};
var previousVal = model.value;
exports.start = function (params) {
  localParams = params;
  //observe(model); //#A
// checkStatus(model.value);
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

// function observe(what) {
//   Object.observe(what, function (changes) {
//     console.info('Change detected by plugin for %s...', pluginName);
//     switchOnOff(model.value); //#B
//   });
// };
function checkStatus(currentVal) {
  if(currentVal != previousVal){
  switchOnOff(model.value);
  }
}
// function switchOnOff(value) {
//   if (!localParams.simulate) {
//     led.write(value === true ? 1 : 0, function () { //#C
//       console.info('Changed value of %s to %s', pluginName, value);
//     });
//   }
// };

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  led = new Gpio(27, 'out');
  // switchOnOff(model.value);
    console.log("The LED status is: "+model.value);
    if(model.value){
    led.writeSync(1);
    }
    else{
    led.writeSync(0);
    }
    setTimeout(connectHardware, localParams.frequency);	
};

function simulate() {
  interval = setInterval(function () {
    
    var Gpio = require('onoff').Gpio;
    actuator = new Gpio(model.gpio, 'out'); //#D
    console.info('Hardware %s actuator started!', pluginName);


    // Switch value on a regular basis
    if (model.value) {
      model.value = false;
      actuator.write(0);
      console.log('LED ==== LOW');
      
    } else {
      model.value = true;
      actuator.write(1);
      console.log('LED ===== HIGH');
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode