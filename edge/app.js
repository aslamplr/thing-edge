const config = require('../.config.json'),
    coap = require('coap'),
    WebSocket = require('ws');

var ws;

let ledstate, ledcontrol;

function connectSocket() {
  try {
    ws = new WebSocket(config.wss);
  } catch (e) {
    console.log("Server seems to be down, no socket connection", e);
  } finally {
    if(ws) registerSocketEvents();
    else setTimeout(()=>{connectSocket();}, 5000);
  }
}

function registerSocketEvents(){
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

    ws.on('error', (e) => {
        console.log("socket error.", e);
    });

    ws.on('close', (m) => {
        console.log("socket closed.", m);
        setTimeout(() => {
            connectSocket();
        }, 9000);
    });

    ws.on('ping', () => {
        console.log("socket pinged.");
        ws.pong('1', {}, true);
    });

    ws.on('pong', () => {
        console.log("socket ponged!");
    });
}

connectSocket();

function command_esp(message) {
    console.log("Sending message to esp %s", message);
    let outMsg = coap.request({
      method: 'PUT',
      hostname: '192.168.43.203',
      pathname: '/led',
      confirmable: true
    });
    outMsg.end(message);
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
