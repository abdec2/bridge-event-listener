require("dotenv").config();
const { Worker } = require('bullmq')

const worker = new Worker('bridge-queue', async (job) => {

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