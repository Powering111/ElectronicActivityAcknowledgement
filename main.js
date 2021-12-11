const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const database = require(path.join(__dirname,'database.js'));

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
    res.render('main',req.session);
});

app.post('/login',(req,res)=>{
    if(database.authenticate(req.body.id,req.body.password)){
        req.session.userID=req.body.id;
        
        req.session.save();
        res.send('OK');
    }
    else{
        res.send('로그인 실패.');
    }
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
})
app.get('/*',(_,res)=>{res.redirect('/');})


app.get('/user',(req,res)=>{
    database.createUser({
        id:'juntae',
        password:'something',
        name:'정준태',
        generation:38,
        classnum:1118,
        privilege:0,
        status:"yeh",
        email:'bestjun111@gmail.com'
    });
    res.send("Hi");
})
app.get('/test',(req,res)=>{
    database.selectUser();
    res.send("yeaj");
})

app.listen(PORT,()=>{
    console.log("서버가 시작되었습니다.");
});