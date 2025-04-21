require('dotenv').config()
const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser")
// const compression = require('compression')
const router = require("./routes/serverRouter");
const app = express();
const PORT = process.env.PORT || 3001;

// app.use(compression({
//     threshold: 1048,
// }))

app.use(express.json());
app.use('/', router)



app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
});