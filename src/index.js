import http from 'node:http';
import path from 'node:path';

import express from 'express';
import { Server } from 'socket.io';

import {publisher, subscriber, redis} from "./redis-connection.js";
import router from './routes/auth.routes.js';
import { verifyToken } from './middleware/auth.middleware.js';

async function main() {

    const app = express();
    const server = http.createServer(app)
    const port = process.env.PORT?? 8080

    const io = new Server();
    io.attach(server)

    app.use(express.json());
    app.use('/api/auth', router);

    await subscriber.subscribe('internal-service:checkbox:change');
    subscriber.on('message', (channel, message) => {
        if(channel === 'internal-service:checkbox:change'){
            const {index, checked} = JSON.parse(message);
            
            io.emit('client:checkbox:changed', {index, checked})
        }
    })

    // socket io handler

    const count = 500;
    const CHECKBOX_STATE_key= 'checkbox-state:v3'

    const rateLimitingHashMap = new Map()

    io.on('connection', (socket) => {
        console.log(`socket connected`, {id: socket.id})

        
        socket.on('client:checkbox:changed', async (data) => {
            console.log(`[Socket:${socket.id}]:client:checkbox:changed`, data)

            const user = verifyToken(data.token);  
            if (!user) {
                return socket.emit('server:error', { error: 'Unauthorized' });
            }

            const lastOperationTime = await redis.get(`rate-limiting:${socket.id}`)
            if(lastOperationTime){
                const timeElapsed = Date.now() - lastOperationTime
                if(timeElapsed < 3*1000){
                    socket.emit('server:error', {error: 'Please wait'})
                    return;
                }
            }
            await redis.set(`rate-limiting:${socket.id}`, Date.now())

            const existingState = await redis.get(CHECKBOX_STATE_key)
            if(existingState){
                const remoteData = JSON.parse(existingState)
                remoteData[data.index] = data.checked
                await redis.set(CHECKBOX_STATE_key, JSON.stringify(remoteData))
            }
            else{
                await redis.set(CHECKBOX_STATE_key, JSON.stringify(new Array(count).fill(false)))
            }
            
            
            await publisher.publish('internal-service:checkbox:change', JSON.stringify(data))
        })
   })


    // express handler

    app.get('/health', (req, res) => res.json({ healthy: true}))
    app.use(express.static(path.resolve('./public')))

    app.get('/', (req, res) => {
        res.sendFile(path.resolve('./public/index.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.resolve('./public/login.html'));
    });

    app.get('/checkboxes', async (req, res) => {
        const existingState = await redis.get(CHECKBOX_STATE_key)
        if(existingState){
            const remoteData = JSON.parse(existingState)
            return res.json({ checkboxes: remoteData})
        }
        return res.json({ checkboxes: new Array(count).fill(false)})

        
    })
    
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })

}

main();