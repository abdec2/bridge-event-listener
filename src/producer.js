require("dotenv").config();
const { startHomeConnection }  = require('./events/EventListenerHome')
const { startForiegnConnection } = require('./events/EventListenerForiegn')

const main = () => {
    startHomeConnection()
    startForiegnConnection()
    console.log('Listening.....')
}

main();