require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const {authRoute} = require("./router/authRouter")
const cors = require("cors");
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/auth", authRoute)

app.listen(port, () => {
    console.log(`Running on PORT: ${port}`)
})
