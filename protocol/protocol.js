
function createProtocol(userName, messageClient) {
    let message = `|${Date.now()}|${userName}|${messageClient}|`
    return `|${message.length}${message}`
}

function decryptionProtocol(data) {
    let userData = data.split('');
    let res = ['', '', '', ''];
    let i = 0;
    let j = 0;
    if (userData[0] === '|') {
        i++;
    }
    while (i < userData.length - 1) {
        if (userData[i] === "|") {
            i++;
            j++;
        }
        res[j] +=  userData[i];
        i++;
    }

   /* let i = 0;
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
    }*/
    return res;
}



module.exports = {
    createProtocol: createProtocol,
    decryptionProtocol: decryptionProtocol
}
