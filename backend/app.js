import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';  
import cors from 'cors';
import { connectDB } from './database/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import notesRoutes from './routes/notesRoutes.js';
import skinroutes from './routes/skinroutes.js';
import dotenv from 'dotenv';
dotenv.config();
export const app = express();
config({path:'./.env'});
connectDB();



if (!process.env.GROQ_API_KEY) {
    console.error("ggggggggggggggggggggggggggggggggggggggMissing GROQ API Key. Please set GROQ_API_KEY in your .env file.");
    process.exit(1);
}



// app.use(cors({
//     origin:process.env.FRONTEND_URL,
//     credentials:true
// }));
// app.use(cors({
//   origin: ["http://localhost:5173"], // frontend origin
//   credentials: true,                 // only needed if you use cookies, optional here
// }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));



console.log("app.js me aya");



app.use('/auth', authRoutes);
app.use('/note'  ,notesRoutes);
app.use('/skinanalysis', skinroutes);
app.use("/chat", chatRoutes);


app.get("/", protect, (req, res) => {
  res.status(200).json({ message: `Welcome to your dashboard` });
});


app.get("/test", (req, res) => {
  res.status(200).json({ message: "Backend is working perfectly!" });
});



const PORT = process.env.PORT || 3000 ;
dotenv.config();

app.listen(PORT, () => {

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:  yha", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");

    console.log(`Server is running on port ${PORT}`);
});