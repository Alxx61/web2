const express = require('express');
const expressWs = require('express-ws');
const { proxy } = require('rtsp-relay')(express());

const app = express();
expressWs(app);  // Enable WebSocket support

app.ws('/api/stream', proxy({
    url: 'rtsp://localhost:8554/stream', // Your RTSP stream URL
    verbose: false,
}));

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
