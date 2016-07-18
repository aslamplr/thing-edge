const mqtt = require("mqtt"),
      client = mqtt.connect("mqtt://127.0.0.1");

const status_topic = 'esp8266/status/led',
      control_topic = 'esp8266/control/led';

var ledstate, ledcontrol;

client.on('connect', ()=>{
    client.subscribe(status_topic);
    client.subscribe(control_topic);
});

client.on('message', (topic, message) => {
    switch(topic){
	case status_topic:
		handle_status_update(message);
		break;
  case control_topic:
    handle_control_topic(message);
    break;
	default:
		console.log("message from topic %s -> %s", topic, message);
    }
});

function handle_control_topic(message){
    ledcontrol = (message.toString()[0] === '1');
    console.log("control published, led to %s", ledcontrol?'up':'off');
}

function handle_status_update(message){
    ledstate = (message.toString()[0] === '1');
    console.log("status recvd from esp, led is %s", ledstate?'up':'off');
}

function command_esp(message){
    console.log("Sending message to esp %s %s", control_topic, message);
    client.publish(control_topic, message);
}

function start_loop(){
  setTimeout(()=>{
    looper();
  }, 15000);

  function looper(){
    if(ledcontrol !== undefined && ledstate !== ledcontrol)
      command_esp(ledcontrol ? '1': '0');
    start_loop();
  }
}

console.log("Hello IoT");
start_loop();
