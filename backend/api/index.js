import express from 'express';
import mongoose from 'mongoose';
import flashcardsRouter from '../routes/flashcards.js';
import 'dotenv/config'
import cors from 'cors';
import auth from '../auth.js';

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

app.use(cors({
  origin: 'https://flashcards-seven-nu.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));
app.use(express.json());
app.use(auth);
app.use('/flashcards',flashcardsRouter)

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})

mongoose
    .connect(uri)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((e)=>{
        console.error(e);
    })