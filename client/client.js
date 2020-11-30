let net = require('net');
let rl = require('../readlineAsync');
let config = require('../config.js');
const protocol = require('../protocol/protocol.js')
const moment = require("moment");

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

let userMessageArr = [];
let checkWork = 0;
let receivedLength = 0;
let userLength,
    userTime,
    userLogin,
    userMessage;

client.setEncoding(encoding);
client.on('data', data => {
    if (data.toString() === 'exit') {
        console.log('You disconnected from server');
        process.exit(0);
    }


    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NEW MESSAGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')
    if (data.toString()[0] !== '|') {
        receivedLength += data.length;
        checkWork++;
        userMessageArr.push(data);
        console.log('checkWork = ', checkWork);
        console.log("length from user messsage = ", userLength, "length received =", receivedLength);
        //console.log(userMessageArr, '\n');
        if (receivedLength - userLength <= 6 && receivedLength - userLength >= 0) {
            console.log(userMessageArr.join(''))
            userMessageArr = [];
        }
    } else {
        [userLength, userTime, userLogin, userMessage] = protocol.decryptionProtocol(data);
        receivedLength = data.length;
        checkWork = 0;
        userMessageArr = [];
        console.log("length принято= ", data.length, "length =", userLength);
        let dateFormat = 'YYYY-DD-MM HH:mm:ss';
        let testDateUtc = moment.utc(+userTime);
        let localDate = testDateUtc.local();
        checkWork++;
        console.log('checkWork = ', checkWork);
        if (receivedLength - userLength === 3) {
            console.log(`${localDate.format(dateFormat)} ${userLogin} : ${userMessage}`);
        } else {
            userMessageArr.push(`${localDate.format(dateFormat)} ${userLogin} : ${userMessage}`);
        }
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
