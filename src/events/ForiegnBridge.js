require("dotenv").config();
const ethers = require('ethers');
const abi = require('./../abi/foriegn_bridge.json');
const contractAddress = process.env.FORIEGN_BRIDGE_ADDRESS;

const foriegnBridgeEvents = () => {
    const provider = new ethers.WebSocketProvider(process.env.FORIEGN_RPC_WS);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const myQueue = new Queue('return-token-queue', {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USER,
            password: process.env.REDIS_PASS
        }
    });
    contract.on("TokensBridged", () => {
        // update status
    })

    contract.on("TokensReturned", async (requester, amount, timestamp, event) => {
        // add job to the queue return queue

        const job = {
            requester,
            amount: amount.toString(),
            timestamp: timestamp.toString(),
            hash: event.log.transactionHash
        }
        const jobq = await myQueue.add('return-token', job, {
            attempts: 3,
            backoff: {
                type: 'fixed',
                delay: 3000,
            },
          
        })
    })
}

module.exports = {
    foriegnBridgeEvents
}

