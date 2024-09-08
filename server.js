import express from 'express';
import bodyParser from 'body-parser';

import LoginRouter  from './routes/login.js';
import RegRouter from './routes/reg.js'



const app = express();
const PORT = 880;

app.use(bodyParser.json());


app.use(express.static('public'));


app.use('/login', LoginRouter);

app.use('/register', RegRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
