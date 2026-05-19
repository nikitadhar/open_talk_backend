import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./database/connection.js";
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1", appRouter);
// ✅ Start server
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log("Server Open & Connected To Database 🤟")
    );
  })
  .catch((err) => console.log(err));
