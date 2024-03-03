require("dotenv").config();
const { Worker } = require('bullmq')
const ethers = require('ethers');
const abi = require('./abi/main_bridge.json');
const contractAddress = process.env.HOME_BRIDGE_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.HOME_RPC_HTTP)


const worker = new Worker('return-token-queue', async (job) => {
    const signer = new ethers.Wallet(process.env.WALLET_KEY, provider)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    const tx = await contract.unlockTokens(job.data.requester, job.data.amount, job.data.hash, {
        gasPrice: "3500000000"
    })

    await tx.wait()

    console.log(job.data)
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS,
        tls: {} 
    }
})

worker.on('completed', job => {
    console.log('completed', job.id)
})

worker.on('failed', job => {
    console.log('failed', job.id)
}) 