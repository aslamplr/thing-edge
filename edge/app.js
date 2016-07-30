const config = require("../.config.json"),
    mqtt = require("mqtt"),
    client = mqtt.connect(config.mqtt),
    WebSocket = require('ws');

const status_topic = 'esp8266/status/led',
    control_topic = 'esp8266/control/led',
    override_topic = 'esp8266/override/led';

var ws = new WebSocket(config.wss);

let ledstate, ledcontrol;

function connectSocket() {
    ws = new WebSocket(config.wss);
    ws.on('open', () => {
        ws.send(JSON.stringify({
            action: 'get'
        }));
        console.log("socket open.");
    });

    ws.on('message', (message) => {
        console.log('received: %s', message);
        let msg = JSON.parse(message),
            status = msg.status;
        ledcontrol = status;
        if (ledstate !== undefined && ledstate !== ledcontrol)
            command_esp(ledcontrol ? '1' : '0');
    });

    ws.on('error', () => {
        console.log("socket error.");
    });

    ws.on('close', () => {
        console.log("socket closed.");
        setTimeout(() => {
            connectSocket();
        }, 60000);
    });

    ws.on('ping',() => {
      console.log("socket pinged.");
      ws.pong('1');
    });

    ws.on('pong',() => {
      console.log("socket ponged!");
    });

    setInterval(()=>{
      console.log("send socket ping to server");
      ws.ping('1');
    }, 9000);
}

connectSocket();

client.on('connect', () => {
    client.subscribe(status_topic);
    client.subscribe(control_topic);
    client.subscribe(override_topic);
});

client.on('message', (topic, message) => {
    switch (topic) {
        case status_topic:
            handle_status_update(message);
            break;
        case control_topic:
            handle_control_topic(message);
            break;
        case override_topic:
            handle_override_topic(message);
            break;
        default:
            console.log("message from topic %s -> %s", topic, message);
    }
});

function handle_override_topic(message) {
    ledcontrol = (message.toString()[0] === '1');
    if (ws.readyState != WebSocket.OPEN) throw new Error('Not connected');
    ws.send(JSON.stringify({
        action: 'post',
        payload: ledcontrol
    }));
    console.log("override published, led to %s", ledcontrol ? 'up' : 'off');
}

function handle_control_topic(message) {
    ledcontrol = (message.toString()[0] === '1');
    console.log("control published, led to %s", ledcontrol ? 'up' : 'off');
}

function handle_status_update(message) {
    ledstate = (message.toString()[0] === '1');
    console.log("status recvd from esp, led is %s", ledstate ? 'up' : 'off');
}

function command_esp(message) {
    console.log("Sending message to esp %s %s", control_topic, message);
    client.publish(control_topic, message);
}

function start_loop() {
    setTimeout(() => {
        looper();
    }, 3000);

    function looper() {
        if (ledcontrol !== undefined && ledstate !== ledcontrol)
            command_esp(ledcontrol ? '1' : '0');
        start_loop();
    }
}

console.log("Hello IoT");
start_loop();
