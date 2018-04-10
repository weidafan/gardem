var resources = require('./../../resources/model'),
utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Soil sensor';
var localParams = { 'simulate': false, 'frequency': 50000 };

exports.start = function (params) {
localParams = params;
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
  sensor.unexport();
}
console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
    var Gpio = require('onoff').Gpio;
    led = new Gpio(27, 'out');
  var Mcp3008 = require('mcp3008.js');
      adc = new Mcp3008();
      channel = 1;
  adc.poll(channel,1003, function (value) {
      console.log("The soil humidity is: "+value);
      if(value<500){
      led.writeSync(1);
      }
      else{
      led.writeSync(0);
      }	
  });
};
