require("dotenv").config();
const { Worker } = require('bullmq')
const ethers = require('ethers');
const abi = require('./abi/foriegn_bridge.json');
const contractAddress = process.env.FORIEGN_BRIDGE_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.FORIEGN_RPC_HTTP)

const transfer = async ({requester, amount, timestamp, hash}) => {
    const signer = new ethers.Wallet(process.env.WALLET_KEY, provider)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    const tx = await contract.bridgeTokens(requester, amount, hash, {
        gasPrice: "3500000000"
    })

    await tx.wait()
}


transfer(
    {
        requester: '0x5baA0f14D09864929c5fC8AbDfDc466dcb72be9d',
        amount: '1000000000000000',
        timestamp: '1708908260',
        hash: '0xd6b9057562648f92280ec83cc9b3e980049f2d30d30533064c66180e070df636'
    }
)