import express from 'express'
import cookieParser from "cookie-parser";
import { connectDB } from './config/db.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorMiddleware.js';
import cors from "cors";

const app = express()
const port = 3002

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', apiRouter)
app.all("*", (req, res, next) => {
  res.status(404).json({ message: "Endpoint does not match" });
});

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})