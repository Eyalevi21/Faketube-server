import express from 'express';
import bodyParser from 'body-parser';

import router  from './routes/login.js';



const app = express();
const PORT = 880;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Login route
app.use('/', router);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
