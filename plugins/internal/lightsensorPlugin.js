var resources = require('./../../resources/model'),
  utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Light sensor';
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
  var Mcp3008 = require('mcp3008.js');
  adc = new Mcp3008();
  channel = 7;
  adc.read(channel, function (value) {
    model.light.value = parseFloat(value.toFixed(2));
    //model.light.value = parseFloat(value);
    console.log("The intensity of ambient light is: " + value);
  });  
  setTimeout(connectHardware, localParams.frequency);
};

