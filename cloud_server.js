const server = require('http').createServer(),
    url = require('url'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        path: '/ws',
        server: server
    }),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 8889,
    bodyParser = require('body-parser');

let ledstate = false;

wss.broadcast = (data) => {
    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
};

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

wss.on('connection', (ws) => {
    var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', (message) => {
        console.log('received: %s', message);
        let req = JSON.parse(message);
        switch (req.action) {
            case 'get':
                ws.send(JSON.stringify({
                    status: ledstate
                }));
                break;
            case 'post':
                ledstate = req.payload;
                ws.send(JSON.stringify({
                    status: ledstate
                }));
                break;
            default:
                console.log("Invalid request");
        }
    });

    ws.send(JSON.stringify({
        status: ledstate
    }));
});

app.route('/api/led')
    .get((req, res) => {
        res.send({
            status: ledstate
        });
    })
    .post((req, res) => {
        ledstate = req.body.status;
        wss.broadcast({
            status: ledstate
        });
        res.send({
            status: ledstate
        });
    });

server.on('request', app);
server.listen(port, () => {
    console.log('Listening on ' + server.address().port)
});
