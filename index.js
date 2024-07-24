const { faker } = require('@faker-js/faker');
const  mysql=require("mysql2")
const express=require("express");
const methodOverride=require("method-override");
const{ v4 : uuidv4 } =require('uuid');

const path=require("path");
const port =3000;
const app=express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'/views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))




const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta',
    password:"@mySqlkhushi"
});
let randomuser=()=> {
    return [
      faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
     faker.internet.password(),

    ];
  };
//insert new data
//let q="insert into user (id,username,email,password) values (?,?,?,?)";
//let user =["123","123_user","abc@gmail.com","abc"]
//let q1="insert into user (id,username,email,password) values ?";
let users=[
    ["1234","1234_user","abc4@gmail.com","abc4"],
    ["1235","1235_user","abc5@gmail.com","abc4"],
];
//let data=[];
//for(let i=0;i<=100;i++){
//  data.push(randomuser());
//}

//try{
//connection.query(q1,[data],(err,result)=>{
   // if(err) throw err;
// console.log(result);


//}) } catch(err){ console.log(err)}

app.listen(port,()=>{
    console.log("server started")
})

app.get('/',(req,res)=>{
 
  try{
    let q=`select count(*) from user`;
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count=result[0]["count(*)"];
      res.render("home.ejs",{count});

    })
  }
  catch(err){
     console.log(err)}
})
app.get('/user',(req,res)=>{
  let q=`select * from  user order by username`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      res.render("show.ejs",{result});
    })
  }
  catch(e){
    console.log(e);
  }

})
app.get('/user/:id/edit',(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      res.render("form.ejs",{user});
     
    })
  }
  catch(e){
    console.log("error in edit user")
  }
 
})

app.patch('/user/:id',(req,res)=>{
  let {id}=req.params
  let{username,password}=req.body;
  let q=`select * from user where id ='${id}'`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      console.log(username);
      if(password!=user.password){
        res.send("wrong password");
      }
      else {
        let q1=`update user set username='${username}' where id='${id}'`;
        try{
          connection.query(q1,(err,result)=>{
            if(err) throw err;
            
            res.redirect('/user')
          })
        }
          catch(e){
             console.log("error in update route")
          }
        
        
      }
    })
  }
  catch(e){
    console.log(e);
  }

 
})
app.get('/user/:id/delete',(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try{
    
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let data=result[0];
      res.render("delete.ejs",{data});
    })
  }
  catch(e){
    console.log(e);
  }
})
app.delete('/user/:id',(req,res)=>{
  let {id}=req.params;
  let{username,email,password}=req.body;
  console.log(username);
  console.log(email);
  let q=`select * from user where id='${id}'`;
  let q2=`delete  from user where id='${id}'`;
  try{
     connection.query(q,(err,result)=>{
       let data=result[0];
       console.log(data)
       if(username===data.username && email===data.email ){
         console.log("done");
          try{
            connection.query(q2,(err,result)=>{
               res.send("deleted successfully");
            })
          }catch(e){
            console.log(e);
          }
       }
       else {
        res.send("send proper info")
       }
     })
  }
  catch(e){
    console.log(e)
  }
 
})
app.get('/user/insert',(req,res)=>{
  res.render("insert.ejs");
})
app.post('/user',(req,res)=>{
  let{username,email,password}=req.body;
  let id=uuidv4();

  console.log(username);
  let q="insert into user (id,username,email,password) values(?,?,?,?)";
  let data=[id,username,email,password];
  console.log(data);
  try{
    connection.query(q,data,(err,result)=>{
      res.redirect('/user');
    })
  }
  catch(e){
    console.log(e);
  }
})
