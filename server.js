import express from 'express';
import bodyParser from 'body-parser';

import LoginRouter  from './routes/login.js';
import RegRouter from './routes/reg.js'
import videoRouter from './routes/videoRoutes.js'
import userRouter from './routes/userRoutes.js'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 880;

app.use(bodyParser.json());


app.use(express.static('public'));


app.use('/', LoginRouter);
app.use('/register', RegRouter);
app.use('/api/users', userRouter);
app.use('/api/videos', videoRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
