const express = require('express');
const app = express();
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://myoungincho:aud38dls5opi@boilerplate.ir64vco.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=>{
    console.log('mongodb connected...')
}).catch(err => console.log(err))
app.get('/', (req, res)=>{
    res.send('Hello world!')
})
// mongodb+srv://<username>:<password>@boilerplate.ir64vco.mongodb.net/?retryWrites=true&w=majority
app.listen(port, ()=>{
    console.log('example app listening on port' + port)
})