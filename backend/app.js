import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import skinroutes from "./routes/skinroutes.js";
import { protect } from "./middleware/authMiddleware.js";

// ✅ Load environment variables only once
dotenv.config({ path: "./.env" });

// ✅ Initialize app
const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/note", notesRoutes);
app.use("/skinanalysis", skinroutes);
app.use("/chat", chatRoutes);

// ✅ Simple route checks
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to PROJECT-HD Backend!" });
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Backend is working perfectly!" });
});

// ✅ Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");
});

// ✅ Export for Vercel (required)
export default app;
