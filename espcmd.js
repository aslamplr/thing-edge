const mqtt = require("mqtt"),
      client = mqtt.connect("mqtt://127.0.0.1");

const status_topic = 'esp8266/status/led',
      control_topic = 'esp8266/control/led';

var arg_msg = (process.argv.length >= 3 ? process.argv[2]: '');

function commandEsp(message){
    console.log("Sending message to esp %s %s", control_topic, message);
    client.publish(control_topic, message);
    client.end();
}

setTimeout(()=> { commandEsp(arg_msg); }, 100);
