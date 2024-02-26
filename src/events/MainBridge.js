require("dotenv").config();
const ethers = require('ethers');
const abi = require('./../abi/main_bridge.json');
const contractAddress = process.env.HOME_BRIDGE_ADDRESS;

const { Queue } = require('bullmq');

const MainBridgeEvents = () => {
    const provider = new ethers.WebSocketProvider(process.env.HOME_RPC_WS);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const myQueue = new Queue('bridge-queue', {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USER,
            password: process.env.REDIS_PASS
        }
    });

    contract.on("TokensLocked", async (requester, amount, timestamp, event) => {
        // add jobb to the bridge-queue 
        const job = {
            requester,
            amount: amount.toString(),
            timestamp: timestamp.toString(),
            hash: event.log.transactionHash
        }
        const jobq = await myQueue.add('bridge-token', job, {
            attempts: 3,
            backoff: {
                type: 'fixed',
                delay: 3000,
            },
          
        })
    })

    contract.on("TokensUnlocked", () => {
        // update status
    })

}

module.exports = {
    MainBridgeEvents
}