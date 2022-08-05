const express = require('express');
const app = express();
const port = 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { User } = require('./models/user');
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')

//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))
//application/json
app.use(express.json())
app.use(cookieParser())

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
app.post('/api/users/register', (req, res)=>{
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

app.post('/api/users/login', (req, res)=>{
    //요청된 이메일을 데이터베이스에서 있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user)=>{
        if (!user){
            return res.json({
                loginSuccess: false,
                message: "이메일에 해당하는 유저가 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch)=>{
            if (!isMatch) 
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            
            user.generateToken((err, user)=>{
                if (err) return res.status(400).send(err)

                //토큰을 저장한다. 어디 ? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId:user._id})
            })
        })
    })
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인

    //비밀번호가 맞다면 토큰을 생성하기
})

app.get('api/users/auth', auth, (req, res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        is_Auth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res)=>{
    User.findOneAndUpdate({_id: req.user._id}, {token: ""},
        (err, user)=>{
            console.log(err);
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            }) 
        })
})
app.listen(port, ()=>{
    console.log('example app listening on port' + port)
})