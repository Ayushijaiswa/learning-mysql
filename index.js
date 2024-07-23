const { faker } = require('@faker-js/faker');
const  mysql=require("mysql2")



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
let q="insert into user (id,username,email,password) values (?,?,?,?)";
let user =["123","123_user","abc@gmail.com","abc"]
let q1="insert into user (id,username,email,password) values ?";
let users=[
    ["1234","1234_user","abc4@gmail.com","abc4"],
    ["1235","1235_user","abc5@gmail.com","abc4"],
];
let data=[];
for(let i=0;i<=100;i++){
  data.push(randomuser());
}

try{
connection.query(q1,[data],(err,result)=>{
    if(err) throw err;
    console.log(result);


}) } catch(err){ console.log(err)}
connection.end();
