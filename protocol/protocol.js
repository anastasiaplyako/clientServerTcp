
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
    return res;
}



module.exports = {
    createProtocol: createProtocol,
    decryptionProtocol: decryptionProtocol
}
