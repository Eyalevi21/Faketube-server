import express from 'express';
import bodyParser from 'body-parser';
import net from 'net';
import loginRouter from './routes/loginRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import userRouter from './routes/userRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 880;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/tokens', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/videos', videoRouter);

app.get('/connection-check', (req, res) => {
  res.status(200).json({ message: 'Server is online' });
});

// Handle POST request from frontend to notify video watch
app.post('/api/video-watched', (req, res) => {
  const { username, vid } = req.body;

  // Establish a connection to the C++ server
  const cppServerPort = 5555; // Port C++ server listens on
  const cppServerHost = '172.25.48.170';

  // Format the message as required by the C++ server
  const message = `WATCH ${username} ${vid}\n`;
  console.log(`Sending message to C++ server: "${message.trim()}"`);
  const client = new net.Socket();

  client.connect(cppServerPort, cppServerHost, () => {
    console.log('Connected to C++ server');
    client.write(message); // Send the watch command
  });

  client.on('data', (data) => {
    console.log('Received from C++ server:', data.toString());
    client.destroy(); // Close the connection after receiving a response
    res.status(200).json({ message: 'Video watch sent to C++ server' });
  });

  client.on('error', (error) => {
    console.error('C++ server connection error:', error);
    res.status(500).json({ message: 'Failed to notify C++ server' });
  });

  client.on('close', () => {
    console.log('Connection to C++ server closed');
  });
});

// Route for getting video recommendations
app.get('/api/recommendations/:vid', (req, res) => {
  const vid = req.params.vid;

  const cppServerPort = 5555;
  const cppServerHost = '172.25.48.170';

  // Format the recommendation request message
  const message = `RECOMMEND_FOR_VIDEO ${vid}\n`;
  const client = new net.Socket();

  client.connect(cppServerPort, cppServerHost, () => {
    console.log('Connected to C++ server for recommendations');
    client.write(message); // Send the recommend command
  });

  client.on('data', (data) => {
    const recommendations = data.toString();
    console.log('Received recommendations from C++ server:', recommendations);
    client.destroy(); // Close the connection after receiving a response
    res.status(200).json({ recommendations });
  });

  client.on('error', (error) => {
    console.error('C++ server connection error:', error);
    res.status(500).json({ message: 'Failed to get recommendations from C++ server' });
  });

  client.on('close', () => {
    console.log('Connection to C++ server closed');
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
