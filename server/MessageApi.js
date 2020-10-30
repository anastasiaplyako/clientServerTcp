module.exports = class MessageApi {
    constructor() {
        this.clients = []
    }

    addClient = client => {
        this.clients.push(client)
    };

    alreadyLoggedIn = client => {
        const index = this.clients.findIndex(value => value.id === client.id)
        return index !== -1
    };

    sendMessage = (msg, sender) => {
        this.clients.forEach(client => {
            console.log("send from server to = " + client.name)
            //let [userTime, userLogin, userMessage] = _decryptionProtocol(data);
            if (client.id !== sender.id) client.write(msg)
        })
    };

    deleteClient = client => {
        let indexClient = this.clients.findIndex(value => value.id === client.id)
        this.clients.splice(indexClient, 1);
    }
}
