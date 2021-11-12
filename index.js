const connectToMongo = require("./db");
const express = require('express');
const cors= require("cors");
const app = express();
const port = 5000;
connectToMongo();
app.use(express.json());
app.use(cors());
//available routes
app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));


app.get("/",(req,res)=>{
    res.json({messsage: "yay!!"});
})

app.listen(port,()=>{
    console.log("server is up and running");
})