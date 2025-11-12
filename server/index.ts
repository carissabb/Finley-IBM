import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRoute from "./routes/token.ts";
import finleyRoute from './routes/finley.ts';



dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", tokenRoute);
app.use('/api/finley', finleyRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
