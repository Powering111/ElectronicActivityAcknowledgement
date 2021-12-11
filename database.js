const sqlite3 = require('sqlite3');
const path = require('path');

let db;
exports.connect= function(){
    if(db === undefined){
        db = new sqlite3.Database(path.join(__dirname,'/db/database.db'),
        sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE,(err)=>{
            if(err){
                console.error('error occurred while opening database');
                console.error(err);
            }
            else{
                console.log("Successfully opened database");
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
exports.selectUser= function(){ //id,name,generation,classnum,privilege,status,email
    db.all(`SELECT * from user`,[],(err,arr)=>{
        if(err) console.error(err);
        else console.log(arr);
    });

}
exports.authenticate= function(id,password){
    const user = db.run(`SELECT id,password from user where id=(?)`,id);
    console.log(user);
    if(user[0] && user[0].password===password){
        return true;
    }else{
        return false;
    }
}

exports.createUser= function(values){
    db.run(`
        INSERT INTO user
        (id,password,name,generation,classnum,privilege,status,email) 
        values (?,?,?,?,?,?,?,?)
    `, values.id,values.password,values.name,values.generation,values.classnum,values.privilege,values.status,values.email);
}
exports.close=function(){
    db.close();
    db=undefined;
}