var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.leds;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  //observe(model); //#A
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


//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode