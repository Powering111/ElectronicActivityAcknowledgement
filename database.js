const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

let db;
const hashData = async (data)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(10, (err,salt)=>{
            if(err) reject(err);
            else{
                bcrypt.hash(data,salt,(err,hash)=>{
                    if(err) reject(err);
                    else{
                        resolve(hash);
                    }
                })
            }
        });
    });
}

exports.connect= function(){
    if(db === undefined){
        db = new sqlite3.Database(path.join(__dirname,'/db/database.db'),
        sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE,(err)=>{
            if(err){
                console.error('데이터베이스 연결 실패');
                console.error(err);
            }
            else{
                console.log("데이터베이스 연결 성공");
            }
        });
        db.run(`
            CREATE TABLE IF NOT EXISTS user(
                primary_key INTEGER PRIMARY KEY AUTOINCREMENT,
                id TEXT NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                generation INTEGER,
                classnum INTEGER,
                privilege INTEGER NOT NULL,
                status TEXT,
                email TEXT
            )
        `,(err)=>{
            if(err)
            console.error(err);
        });
    }
}
exports.selectUser= function(){
    db.all(`SELECT * from user`,[],(err,arr)=>{
        if(err) console.error(err);
        else console.log(arr);
    });
}

exports.getUserInfo= function(id){
    return new Promise((resolve,reject)=>{
        db.each(`SELECT id,name,generation,classnum,privilege,status,email
                 from user where id=(?)`,[id],(err,arr)=>{
            if(err) reject(err);
            else resolve(arr);
        });
    });
}

exports.checkID=function(id){
    return new Promise(function(resolve, reject){
        console.log('each');
        db.each(`SELECT id from user where id=(?)`,[id],(err,row)=>{
            console.log("fin");
            if(!err){
                console.log(row);
                if(row) resolve(false);
                else resolve(true);
            }else{
                reject(err);
            }
        });
    });
    
}
exports.authenticate= function(id,password){
    return new Promise(function(resolve,reject){
        db.each(`SELECT id,password from user where id=(?)`,id,(err,user)=>{
            if(err) reject(err);
            else{
                console.log("user : ",user);
                if(user){
                    bcrypt.compare(password, user.password,(err,match)=>{
                        if(err) reject(err);
                        else resolve(match);
                    }
                    );
                }
                else{
                    resolve(false);
                }
            }
        });
        
    });
}

exports.createUser= async function(values){
    const passwordHashed = await hashData(values.password);
    db.run(`
        INSERT INTO user
        (id,password,name,generation,classnum,privilege,status,email) 
        values (?,?,?,?,?,?,?,?)
    `, values.id,passwordHashed,values.name,values.generation,values.classnum,values.privilege,values.status,values.email);
}
exports.close=function(){
    db.close();
    db=undefined;
}
