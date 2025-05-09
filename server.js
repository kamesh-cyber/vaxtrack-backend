require('dotenv').config()
const express = require("express");
const cors = require("cors");
const router = require("./routes/serverRouter");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use('/', router)



app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
});