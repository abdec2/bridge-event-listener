require("dotenv").config();
const { Worker } = require('bullmq')
const ethers = require('ethers');
const abi = require('./abi/foriegn_bridge.json');
const contractAddress = process.env.FORIEGN_BRIDGE_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.FORIEGN_RPC_HTTP)


const worker = new Worker('bridge-queue', async (job) => {
    const signer = new ethers.Wallet(process.env.WALLET_KEY, provider)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    const tx = await contract.bridgeTokens(job.data.requester, job.data.amount, job.data.hash, {
        gasPrice: "3500000000"
    })

    await tx.wait()

    console.log(job.data)
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS 
    }
})

worker.on('completed', job => {
    console.log('completed', job.id)
})

worker.on('failed', job => {
    console.log('failed', job.id)
}) 




