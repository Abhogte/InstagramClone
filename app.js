const express = require('express')
const app = express()
const mongoose = require("mongoose")
const PORT = 5000
const{MONGOURI} = require('./keys')



mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to mongo yeah")
}) 
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user')
require('./models/post')
 
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
// Addi#6336


app.listen(PORT,()=>{
    console.log("Server is Running on Port", PORT)
})