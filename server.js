import express from 'express';
import bodyParser from 'body-parser';

import LoginRouter  from './routes/login.js';
import RegRouter from './routes/reg.js'
import videoRouter from './routes/videoRoutes.js'
import userRouter from './routes/userRoutes.js'



const app = express();
const PORT = 880;

app.use(bodyParser.json());


app.use(express.static('public'));


app.use('/', LoginRouter);
app.use('/register', RegRouter);
app.use('/', userRouter);
app.use('/', videoRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
