var resources = require('./../../resources/model'),
  utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Temperature & Humidity';
var localParams = { 'simulate': false, 'frequency': 50000 };

exports.start = function (params) {
  localParams = params;
  // observe(model); //#A  
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

// function observe(what) {
//   Object.observe(what, function (changes) {
//     console.info('Change detected by plugin for %s...', pluginName);
//   });
// };

function connectHardware() {
  var rpiDhtSensor = require('rpi-dht-sensor');
  var dht = new rpiDhtSensor.DHT11(4);
  var readout = dht.read();
  model.temperature.value = parseFloat(readout.temperature.toFixed(2));
  model.humidity.value = parseFloat(readout.humidity.toFixed(2));
  console.log('True Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
    'humidity: ' + readout.humidity.toFixed(2) + '%');
  setTimeout(connectHardware, localParams.frequency);
};

 
  //  var sensorDriver = require('node-dht-sensor');
  //   var sensor = {
  //     initialize: function () {
  //       return sensorDriver.initialize(11, model.temperature.gpio); //#A
  //     },
  //     read: function () {
  //       var readout = sensorDriver.read(); //#B
  //       model.temperature.value = parseFloat(readout.temperature.toFixed(2));
  //       model.humidity.value = parseFloat(readout.humidity.toFixed(2)); //#C
  //      console.log('True Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
  //    'humidity: ' + readout.humidity.toFixed(2) + '%');
  //       showValue();

//   setTimeout(function () {
//     sensor.read(); //#D
//   }, localParams.frequency);
// }
// if (sensor.initialize()) {
//   console.info('Hardware %s sensor started!', pluginName);
//   sensor.read();
// } else {
//   console.warn('Failed to initialize sensor!');
// }
// };

function simulate() {
  interval = setInterval(function () {
    model.temperature.value = utils.randomInt(0, 40);
    model.humidity.value = utils.randomInt(0, 100);
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info('True Temperature: %s C, humidity %s \%',
    model.temperature.value, model.humidity.value);
};

//#A Initialize the driver for DHT22 on GPIO 12 (as specified in the model)
//#B Fetch the values from the sensors
//#C Update the model with the new temperature and humidity values; note that all observers will be notified
//#D Because the driver doesn’t provide interrupts, you poll the sensors for new values on a regular basis with a regular timeout function and set sensor.read() as a callback
