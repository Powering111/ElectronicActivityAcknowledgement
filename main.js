const { checkPrime } = require('crypto');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const database = require(path.join(__dirname,'database.js'));
const readline = require("readline");
const { getUserInfo } = require('./database');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
reader.on('line',function(line){
    if(line==='stop'){
        console.log("stopping...");
        database.close();
        process.exit();
    }
    if(line==='users'){
        database.selectUser();
    }
});

const app = express();
const {
    PORT = 80,
    SESSION_LIFETIME = 1000*60*60*2, // 2시간
    SESSION_NAME = 'login',
    SESSION_SECRET = 'secret',
    NODE_ENV = 'development'
} = process.env;
const IN_PRODUCTION = NODE_ENV === 'production'

app.set('view engine','pug');
app.set('views',path.join(__dirname,'/doc/views'));
app.use(express.static(path.join(__dirname,'/doc/static')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized:false,
    secret: SESSION_SECRET,
    cookie:{
        maxAge: SESSION_LIFETIME,
        sameSite:true,
        secure:IN_PRODUCTION
    },
    store:new FileStore()
}));
database.connect();



app.get('/', (req,res)=>{
    res.render('main',req.session.data);
});

app.post('/login',(req,res)=>{
    database.authenticate(req.body.id,req.body.password).then((result)=>{
        if(result){
            console.log("yeah");
            database.getUserInfo(req.body.id).then((user)=>{
                console.log("yeah2",user);
                req.session.data={};
                Object.assign(req.session.data,user);
                console.log(req.session);
                req.session.save();
                res.send('OK');
            }).catch((err)=>{
                console.log(err);
                res.send('서버 에러!');
            });
        }
        else{
            res.send('로그인 실패.');
        }
    }).catch((err)=>{
        res.send('서버 에러');
        console.error(err);
    });
});
app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("error while destroying session");
        }else{
            res.redirect('/');
        }
    });
});

app.get('/register',(req,res)=>{
    if(req.session.id){
        res.render('register');
    }else{
        res.redirect('/');
    }
});
app.post('/register',(req,res)=>{
    //TODO 예외처리
    database.createUser(req.body);
});

app.get('/check',async (req,res)=>{
    database.checkID(req.query.id).then((result)=>{
        if(result){
            res.send("OK");
        }
        else{
            res.send('이 ID는 이미 사용되었습니다.');
        }
    }).catch((err)=>{
        res.send('원인 불명의 오류 발생');
        console.log(err);
    });
});
app.get('/user',(req,res)=>{
    database.createUser({
        id:'abcd',
        password:'abcd',
        name:'Juntae',
        generation:38,
        classnum:1111,
        privilege:0,
        status:"asdfasdf",
        email:'aasdfasdff'
    });
    res.send("Hi");
})

app.get('/*',(_,res)=>{res.redirect('/');})



//------------------------------------

//------------------------------------
app.listen(PORT,()=>{
    console.log("서버가 시작되었습니다.");
});

getUserInfo('juntae').then((info)=>{
    console.log(info);
}).catch((err)=>{
    console.error(err);
});
// console.log('juntae : ',database.checkID('juntae'));
// console.log('junte : ',database.checkID('junte'));
//database.selectUser();