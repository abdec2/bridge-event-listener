require("dotenv").config();
const { MainBridgeEvents }  = require('./events/MainBridge')
const { foriegnBridgeEvents } = require('./events/ForiegnBridge')

const main = () => {
    MainBridgeEvents()
    foriegnBridgeEvents()
    console.log('Listening.....')
}

main();