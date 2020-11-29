let net = require('net');
let rl = require('../readlineAsync');
let config = require('../config.js');
const protocol = require('../protocol/protocol.js')
const moment = require("moment");
const readline = require('readline');
const port = config.PORT;
const host = config.HOST;
const encoding = config.ENCODING;
let isLogin = false;
let userName = '';

const client = net.createConnection({host: host, port: port}, () => {
    console.log(`Connected to ${host}:${port}`)
});


function checkSpecialSymbols(userMsg) {
    let userMsgArray = userMsg.split("");
    return userMsgArray.indexOf('|') === -1
}

rl.onLine(line => {
    if (!checkSpecialSymbols(line)) {
        console.log("You cant use special symbols '|'")
    } else {
        if (!isLogin) {
            isLogin = true;
            userName = line;
        } else {
            process.on('SIGINT', function () {
                client.write(protocol.createProtocol(userName, 'exit'));
            });
            client.write(protocol.createProtocol(userName, line));
        }
    }
});


/*
var cl = readline.createInterface( process.stdin, process.stdout );
var question = function(q) {
    return new Promise( (res, rej) => {
        cl.question( q, answer => {
            if (!isLogin) {
                isLogin = true;
                userName = answer;
            } else {
                process.on('SIGINT', function () {
                    client.write(protocol.createProtocol(userName, 'exit'));
                });
                client.write(protocol.createProtocol(userName, answer));
            }
            res(answer);

        })
    });
};

(async function main() {
    var answer;
    while ( answer != 'exit' || answer !== 'SIGINT') {
        answer = await question('Your message? ');
    }
    console.log( 'finally you are sure!');
})();
*/

client.setEncoding(encoding);
client.on('data', data => {
    if (data.toString() === 'exit') {
        console.log('You disconnected from server');
        process.exit(0);
    }
    console.log('data = ', data);

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NEW MESSAGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')
    if (data.toString()[0] !== '|') {
        console.log(data);
    } else {
        let [userLength, userTime, userLogin, userMessage] = protocol.decryptionProtocol(data);
        console.log('length = ' + userLength + '\n');
        let dateFormat = 'YYYY-DD-MM HH:mm:ss';
        let testDateUtc = moment.utc(+userTime);
        let localDate = testDateUtc.local();
        console.log(`${localDate.format(dateFormat)} ${userLogin} : ${userMessage}`);
    }
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
