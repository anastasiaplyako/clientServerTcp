let net = require('net');
let shortId = require('shortid');
let config = require('../config.js');
let messageAPI = require('./MessageApi.js');
const protocol = require('../protocol/protocol.js')

const server = net.createServer();
const port = config.PORT;

const messageApi = new messageAPI();

server.on('connection', socket => {
    const id = shortId.generate();
    socket.id = id;
    socket.on('data', data => {
        console.log("=====================================================DATA SERVER ==================================")
        let [userTime, userLogin, userMessage] = protocol.decryptionProtocol(data.toString());
        if (userMessage === 'exit'){
            messageApi.deleteClient(socket);
            socket.end();
            return;
        } else {
            if (!messageApi.alreadyLoggedIn(socket)) {
                socket.name = userLogin;
                messageApi.addClient(socket);
            }
            //client
            messageApi.sendMessage(data, socket)
        }
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    socket.on('end', () =>{});
    socket.on('error', () =>
        process.emitWarning(new Error(`${socket.name || socket.id} disconnected2`)))
});

server.on('error', () => process.emitWarning(new Error('Something went wrong!')));

server.listen(port, () =>
    process.stdout.write(`Server started on port ${port}\n`));

