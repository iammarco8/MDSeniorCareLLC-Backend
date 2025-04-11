// all the required imports 
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import ejs from 'ejs';

import { customerRouter } from './routes/customerRouter.js';
import { wardRouter } from './routes/wardRouter.js';

const app = express();

app.set('view engine', ejs);
// app.options('*', cors(['https://mdseniorcarellc-backend.onrender.com']));
// app.use(cors(['https://mdseniorcarellc-backend.onrender.com']))
app.options('*', cors(['http://localhost:4200']));
app.use(cors(['http://localhost:4200']))

app.use(express.json({limit:'5kb'}));
app.use(express.urlencoded({
    extended:true, limit:'5kb'
}));

if(process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// route connections
app.use('/api/MDSeniorCareLLC/v1/customer', customerRouter);
app.use('/api/MDSeniorCareLLC/v1/ward', wardRouter);

// const port = process.env.PORT;
const port = process.env.PORT;
const server = app.listen(port, ()=>{
console.log(`http://localhost:${port}/`);
});