import express from 'express';
import connectDB from './config/db.js';
import { sendOTP, verifyOTP } from './controllers/authController.js';
import dotenv from 'dotenv';
dotenv.config();

await connectDB();

const app = express();
app.use(express.json());

app.post('/send-otp', sendOTP);
app.post('/verify-otp', verifyOTP);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})