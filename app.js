import express from 'express';
import https from 'https'
import fs from 'fs'

const port = 9080
const app = express();

app.disable('x-powered-by');

app.use('/public', express.static('public'));
app.use('/', express.static('dist'));

if (process.env.NODE_ENV == "production") {
    app.listen(port, err => {
        console.log(`[ + ] The server is running.`);
    });
} else {
    const options = {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem')
    };

    const server = https.createServer(options, app);

    server.listen(port, () => {
      console.log("HTTPS server listening on port " + port);
    });
}    