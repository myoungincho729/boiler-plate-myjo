const express = require('express');
const app = express();
const port = 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { User } = require('./models/user');
const config = require('./config/key')
//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))
//application/json
app.use(express.json())

// mongodb+srv://<username>:<password>@boilerplate.ir64vco.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=>{
    console.log('mongodb connected...')
}).catch(err => console.log(err))

app.get('/', (req, res)=>{
    res.send('Hello world! +++')
})

//회원가입
app.post('/register', (req, res)=>{
    const user = new User(req.body)

    user.save((err, userInfo)=>{
        if (err) {
            console.log('errr');
            return res.json({success:false, err})
        }
        else {
            console.log('yes')
            return res.status(200).json({
                success: true
            })
        }
    })
})

app.listen(port, ()=>{
    console.log('example app listening on port' + port)
})