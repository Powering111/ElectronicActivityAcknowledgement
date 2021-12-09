const express = require('express');
const pug = require('pug');
const path = require('path');

const app = express();
const port = 80;
const mainPage = pug.compileFile(path.join(__dirname,'/doc/login.pug'));

app.get('/', function(req,res){
    console.log(req.params);

    res.send(mainPage({name:'KJH'}));
});

app.listen(port,()=>{
    console.log("서버가 시작되었습니다.");
});