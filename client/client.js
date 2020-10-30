let net = require('net');
let rl = require('../readlineAsync');
let config = require('../config.js');
const protocol = require('../protocol/protocol.js');
const moment = require("moment");

const port = config.PORT;
const host = config.HOST;
const encoding = config.ENCODING;
let isLogin = false;
let userName = '';

const client = net.createConnection({host: host , port: port}, () => {
    console.log(`Connected to ${host}:${port}`)
});

rl.onLine(line => {
    if (!isLogin) {
        isLogin = true;
        userName = line;
    } else {
        process.on('SIGINT', function () {
            client.write(protocol.createProtocol(userName, 'exit'));
        });
        client.write(protocol.createProtocol(userName, line));
    }
});

client.setEncoding(encoding);
client.on('data', data => {
    if (data.toString() === 'exit') {
        console.log('You disconnected from server');
        process.exit(0);
    }
    let [userTime, userLogin, userMessage] = protocol.decryptionProtocol(data);
    let dateFormat = 'YYYY-DD-MM HH:mm:ss';
    let testDateUtc = moment.utc(+userTime);
    let localDate = testDateUtc.local();
    console.log(`${localDate.format(dateFormat)} ${userLogin} : ${userMessage}`);
});

client.on('error', () => {
    console.log('Oops! Something unexpected happend');
    process.exit(0);
});

client.on('end', function () {
    console.log('disconnected from server');
    process.exit(0);
});

client.on('close', function () {
    console.log('disconnected from server');
    process.exit(0);
});

client.on('destroy', function () {
    console.log('disconnected from server');
    process.exit(0);
});
