const express = require('express');
const pug = require('pug');
const path = require('path');

const app = express();
const port = 80;
const mainPage = pug.compileFile(path.join(__dirname,'/doc/main.pug'));

app.get('/:name', function(req,res){
    console.log(req.params);

    res.send(mainPage({name:req.params.name}));
});

app.listen(port,()=>{
    console.log("서버가 시작되었습니다.");
});