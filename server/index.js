import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {userRouter} from "./routes/user.js";
import { txRouter } from "./routes/transaction.js";
import cors from "cors";
const app = express();

dotenv.config();
mongoose.connect(process.env.MONGO_DB_URL, { useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB: %s \n ', mongoUrl) }) 
    .catch((err) => { console.error();
    ('MongoDB connection error: %s \n', err); });

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tx", txRouter);

app.listen(3000, () => console.log('Server started on PORT 3000'));