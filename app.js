import express from 'express';
import https from 'https'
import fs from 'fs'
import { Server } from "socket.io";
import * as signaling from './signaling.js';


const port = 9080
const app = express();

app.disable('x-powered-by');

app.use('/public', express.static('public'));
app.use('/', express.static('dist'));

async function socketInit (server) {
    const io = new Server(server);
    return io;
}

async function startSocketServer(server) {
    let io = await socketInit(server);
    await signaling.socket(io)
}

async function startDevelopment() {
    const options = {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem')
    };

    const server = https.createServer(options, app);
    console.log("[ + ] enable socket io")
    let io_server = await startSocketServer(server);

    server.listen(port, () => {
      console.log("HTTPS server listening on port " + port);
    });
}

async function startProduction() {
    app.listen(port, err => {
        console.log(`[ + ] The server is running.`);
    });

    console.log("[ + ] enable socket io")
    let io_server = await startSocketServer(app);
}


if (process.env.NODE_ENV == "production") {
    startProduction()
} else {
    startDevelopment()
}    