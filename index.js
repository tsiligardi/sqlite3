const sqlite3 = require("sqlite3")
const express = require ("express")
const app = new express()
app.use(express.json())


const db = new sqlite3.Database(':memory:') //se metto un percorso di file crea un file che dopo andrà a modificare;

db.serialize(()=> {
  db.run("CREATE TABLE users (username TEXT, password TEXT)");

  var stmt = db.prepare("INSERT INTO users VALUES (?,?)")
  for (var i = 0; i < 10; i++) {
      stmt.run("pippo" + i, "pluto"+i)
  }
  stmt.finalize()
})

app.post("/login",(req,res)=>{
    const { user,password } = req.body

    db.get("SELECT * FROM users WHERE username = ? AND password = ?",user,password,(err,row)=>{
        if (err) console.log(err)
        else{
            if (row) res.json({status : 200, msg: "login"})
            else res.json({status : 401, msg: "error"})
        }
    })
})

app.listen(8080,()=>{console.log('server listening on port 8080')})
