const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = 3001;

const { encrypt, decrypt } = require('./EncryptionHandler')

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'',
    database:'passwordmanager',

}) 

app.post('/addpassword', (req, res) => {
    const {password, url, username } = req.body;

    const hashedPassword = encrypt(password);
    

    db.query("INSERT INTO password (password, url, username, iv) VALUES (?,?,?,?) ",[hashedPassword.password, url, username, hashedPassword.iv], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send('Success')
        }
    })

 });


app.get("/showpassword", (req, res) => {
    db.query("SELECT * FROM password;", (err,result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result);
        }
    })
});

app.post('/decryptpassword', (req, res) => {
    res.send(decrypt(req.body)) 
})
  
app.listen(PORT, () => {
    console.log('Server is started')
});