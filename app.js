const mqtt = require("mqtt"),
      client = mqtt.connect("mqtt://127.0.0.1");

const status_topic = 'esp8266/status/led',
      control_topic = 'esp8266/control/led';

var ledstate, arg_msg = (process.argv.length >= 3 ? process.argv[2]: '');

client.on('connect', ()=>{
    client.subscribe(status_topic);
});

client.on('message', (topic, message) => {
    switch(topic){
	case status_topic:
		handleStatusUpdate(message);
		break;
	default:
		console.log("message from topic %s -> %s", topic, message);
    }
        ledstate = (message.toString() === '1');
});

function handleStatusUpdate(message){
    ledstate = (message.toString() === '1');
    console.log("status recvd from esp, led is %s", ledstate?'up':'off');
}

function commandEsp(message){
    console.log("Sending message to esp %s %s", control_topic, message);
    client.publish(control_topic, message);
}

console.log("Hello IoT");
setTimeout(()=> { commandEsp(arg_msg); }, 5000);
commandEsp('0');
