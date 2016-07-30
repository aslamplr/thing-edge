const HOST = location.origin.replace(/^http/, 'ws');

export function onChange(callback) {
    let ws = connectSocket(callback);
    setInterval(()=>{
      if(ws.readyState !== ws.OPEN){
        if(ws.readyState !== ws.CLOSED){
          ws.close();
        }
        console.log("reconnecting socket");
        ws = connectSocket(callback);
      }
    },3000);
}

function connectSocket(callback){
    let ws = new WebSocket(HOST+'/ws');
    ws.onmessage = (event) => {
        console.log('received: %s', event.data);
        let message = JSON.parse(event.data);
        callback(message);
    };
    return ws;
}
