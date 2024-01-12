const express = require('express')
const app = express()
const cors = require('cors')
const databaseConnect = require("./config/database")
const authRouter = require('./routes/authRoute')
const messengerRouter = require('./routes/messengerRoute')
const cookieParser = require('cookie-parser')

require('dotenv').config({
    path: `${__dirname}/.env`
})

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
app.use(express.json());

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