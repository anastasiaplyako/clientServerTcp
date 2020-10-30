let time = require("moment");
const moment = require("moment");

function createProtocol(userName, messageClient) {
    var dateFormat = 'YYYY-DD-MM HH:mm:ss';
    var testDateUtc = moment.utc(Date.now()).format(dateFormat);
    console.log("testDateUtc = " + testDateUtc)
    let loginLength = userName.length;
    return `${Date.now()}[${loginLength}${userName}]${messageClient}`
}

function decryptionProtocol(data) {
    let userData = data.split('');
    let res = ['', '', ''];
    let i = 0;
    let j = 0;
    let lengthLoginClient = '';
    let isLogin = false;
    while (i < data.length) {
        if (userData[i] === '[' && !isLogin) {
            isLogin = true;
            let lengthLoginServer = 0;
            i++;
            j++;
            //find length of login from protocol
            while (!isNaN(userData[i])) {
                lengthLoginClient += userData[i];
                i++;
            }
            //find login
            while (lengthLoginServer < lengthLoginClient) {
                res[j] += userData[i];
                i++;
                lengthLoginServer++;
            }
            if (lengthLoginServer == lengthLoginClient) {
                i++;
                j++;
            }
        }
        res[j] += userData[i];
        i++;
    }
    return res;
}


module.exports = {
    createProtocol: createProtocol,
    decryptionProtocol: decryptionProtocol
}
