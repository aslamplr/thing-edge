const config = require('../.config.json'),
      coap = require('coap');

const arg_msg = (process.argv.length >= 3 ? process.argv[2]: '');

function command_esp(message){
    console.log("Sending message to esp %s", message);
    let outMsg = coap.request({
      method: 'PUT',
      hostname: '192.168.43.203',
      pathname: '/led',
      confirmable: true
    });
    outMsg.end(message);
}

setTimeout(()=> { command_esp(arg_msg); }, 100);
