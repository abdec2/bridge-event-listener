require("dotenv").config();
const { Queue } = require('bullmq');

async function  main() {
    const myQueue = new Queue('bridge-queue', {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USER,
            password: process.env.REDIS_PASS,
            tls: {}
        }
    });

    const job = {
        requester: 'reasd',
        amount: 'amount.toString()',
        timestamp: 'timestamp.toString()',
        hash: 'event.log.transactionHash'
    }
    const jobq = await myQueue.add('bridge-token', job, {
        attempts: 3,
        backoff: {
            type: 'fixed',
            delay: 3000,
        },
      
    })
}

main()  