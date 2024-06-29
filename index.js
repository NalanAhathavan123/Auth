const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('./Model/user.model')
const app = express();
app.use(express.json());
const db = async ()=>{
  try{
    await mongoose.connect('mongodb://localhost:27017/auth-demo')
    .then(()=>{
        console.log("Connection success");
    })
  }
  catch(error){
    console.log("Connection failed")
    console.log(error.message);
  }
}
db();

app.post('/register', async(req,res)=>{
    const userinfo = req.body;
     try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userinfo.password, salt);
        userinfo.password = hashedPassword;
        const use = await user.create(userinfo)
        .then(()=>res.send("Registration is successful"))
     }
     catch(error){
        res.status(500).json(error.message)
     }
})

app.post('/login', async(req,res)=>{
    let userCred = req.body;
    try{
        await user.findOne({email:userCred.email})
        .then((email)=>{
            if(email!=null){
                 bcrypt.compare(userCred.password,email.password,(err,result)=>{
                    if(result === true){
                        jwt.sign({email:userCred.email},"nalan",(err,token)=>{
                            if(!err){
                                console.log(token);
                                res.send({token:token});
                            }
                        })
                    }
                    else{
                        res.send("Login is failed");
                    }
                 })
            }
            else{
                res.send("Email does not exist..")
            }
        })
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Not found!..")
    }
})

app.get('/get-data',verifyToken,(req,res)=>{
    res.send("Working like wine..");
})
function verifyToken(req,res,next){
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"nalan",(err,data)=>{
        if(!err){
            console.log(data);
            next();
        }
        else{
            res.send("Invalid token id user..");
        }
    })
}
app.listen(8000,()=>console.log("Server is running successfully..."));
