import express, { json } from 'express'
import cors from 'cors'
import databaseConnect from "./config/database.js"
import authRouter from './routes/authRoute.js'
import messengerRouter from './routes/messengerRoute.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: `${__dirname}/.env`})

const app = express()

app.use(cors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Expose-Headers", "Set-Cookie")
    
    next();
});

app.use(cookieParser())
app.use(json());

app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRouter);

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Server')
})

databaseConnect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})