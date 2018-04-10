// Final version
var httpServer = require('./servers/http'),
wsServer = require('./servers/websockets'),
resources = require('./resources/model');
fs = require('fs');
var createServer = function (port, secure) {
if (process.env.PORT) port = process.env.PORT;
else if (port === undefined) port = '8484';
if (secure === undefined) secure = 'secure';

initPlugins(); //#A

if(secure) {
  var https = require('https'); //#B
  var certFile = './resources/caCert.pem'; //#C
  var keyFile = './resources/privateKey.pem'; //#D
  var passphrase = 'cnurobot'; //#E

  var config = {
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile),
    passphrase: passphrase
  };

  return server = https.createServer(config, httpServer) //#F
    .listen(port, function () {
      wsServer.listen(server); //#G
      console.log('Secure WoT server started on port %s', port);
  })
} else {
  var http = require('http');
  return server = http.createServer(httpServer)
    .listen(process.env.PORT || port, function () {
      wsServer.listen(server);
      console.log('Insecure WoT server started on port %s', port);
  })
}
};

function initPlugins() {
// Internal Plugins
var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
pirPlugin = require('./plugins/internal/pirPlugin'), //#A
dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'); //#A
lightSensorPlugin = require('./plugins/internal/lightsensorPlugin'); //#A
soilSensorPlugin = require('./plugins/internal/soilSensorPlugin');
valvePlugin = require('./plugins/internal/valvePlugin');
// Internal Plugins for sensors/actuators connected to the PI GPIOs
// If you test this with real sensors do not forget to set simulate to 'false'

pirPlugin.start({'simulate': false, 'frequency': 2000}); //#B



ledsPlugin.start({'simulate': false, 'frequency': 1001}); //#B

//ledsPlugin.start({'simulate': false, 'frequency': 200}); //#B

lightSensorPlugin.start({'simulate': false, 'frequency': 1000}); //#B

// soilSensorPlugin.start({'simulate': false, 'frequency': 1000});

valvePlugin.start({'simulate': false, 'frequency': 1000});

dhtPlugin.start({'simulate': false, 'frequency': 1000}); //#B

// External Plugins
var coapPlugin = require('./plugins/external/coapPlugin');
coapPlugin.start({'simulate': false, 'frequency': 10000});
}

module.exports = createServer;

process.on('SIGINT', function () {
ledsPlugin.stop();
pirPlugin.stop();
dht22Plugin.stop();
lightSensorPlugin.stop();
soilSensorPlugin.stop();
valvePlugin.stop();
console.log('Bye, bye!');
process.exit();
});
// HTTP Server
//var server = httpServer.listen(resources.pi.port, function () {
//  console.log('HTTP server started...');

// Websockets server
//  wsServer.listen(server);

//  console.info('Your WoT Pi is up and running on port %s', //resources.pi.port);
//#A Require all the sensor plugins you need
//#B Start them with a parameter object; here you start them on a laptop so you activate the simulation function



/*
// Initial version:
var httpServer = require('./servers/http'), //#A
resources = require('./resources/model');

var server = httpServer.listen(resources.pi.port, function () { //#B
console.info('Your WoT Pi is up and running on port %s', resources.pi.port); //#C
});

//#A Load the http server and the model
//#B Start the HTTP server by invoking listen() on the Express application
//#C Once the server is started the callback is invoked
*/
