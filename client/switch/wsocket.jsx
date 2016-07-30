const HOST = location.origin.replace(/^http/, 'ws');

export function onChange(callback) {
    let ws = new WebSocket(HOST+'/ws');
    ws.onmessage = (event) => {
        console.log('received: %s', event.data);
        let message = JSON.parse(event.data);
        callback(message);
    };
}
