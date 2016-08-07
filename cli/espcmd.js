const config = require("../.config.json"),
      mqtt = require("mqtt"),
      client = mqtt.connect(config.mqtt),
      WebSocket = require('ws');

const status_topic = 'esp8266/status/led',
      control_topic = 'esp8266/control/led';

const arg_msg = (process.argv.length >= 3 ? process.argv[2]: '');

function command_esp(message){
    console.log("Sending message to esp %s %s", control_topic, message);
    client.publish(control_topic, message);
    client.end();
    let ws;
    try {
      ws = new WebSocket(config.wss);
      ws.send(JSON.stringify({action: 'post', payload: message[0] == '1'}));
      ws.close();
    } catch (e) {
      if(ws) ws.close();
      console.log("Server seems to be down, no socket connection", e);
    }
}

setTimeout(()=> { command_esp(arg_msg); }, 100);
