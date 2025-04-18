const express=require('express')
const path=require('path')
const app=express()
const cors=require('cors')
const session= require('express-session')
const cookieParser = require('cookie-parser');
const { errorMessage } = require('./error.js');
app.use(cookieParser());

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const user=[{username:'user123',password:'1111'}]

app.use(session({
    secret:'sec web assignment2',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:60000*60}
}))
app.use(express.static(path.join(__dirname,'../public/style')))

app.get('/',(req,res)=>{
   res.redirect('/login')
   res.sendFile(path.join(__dirname,'../public/login.html'))
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'))
 })

app.get('/admin',(req,res)=>{
    
   if(req.cookies.isAdmin=='true'&&req.session.user)
    res.sendFile(path.join(__dirname,'../public/admin.html'))
   else res.status(401).send(errorMessage)
 })

 app.get('/account',(req,res)=>{  
    
    if(req.session.user)
    res.sendFile(path.join(__dirname,'../public/account.html'))
    else res.status(401).send(errorMessage)
    
    
})


app.post('/login',(req,res)=>{
    const {username,password}=req.body
    if(user[0].username==username&&user[0].password==password){
        req.session.user={username,password}
        if(req.session.user){
           res.cookie('isAdmin',false,{httpOnly:false,path:'/'})
           res.redirect('/account') 
        }
    }
    else {
        res.send(`
            <script>
                alert("Login failed");
                window.location.href = "/";
            </script>
        `);
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err) {
            return res.send('logout faild')
        }
        else{
            res.clearCookie('isAdmin')
            res.redirect('/')
        } 
    })
})

app.listen(2000,()=>{
    console.log('the server running on localhost:2000')
    
})