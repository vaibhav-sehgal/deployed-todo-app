const port=process.env.PORT || 5000;
const express = require('express');
const{v4:uuidv4}=require('uuid')
const cors=require('cors')
const app = express()
const db= require( './db');
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')

app.use(cors())
app.use(express.json());

//get all todo

app.get('/',(req,res)=>{
    res.send('hello vaibhav')
})

app.get('/todos/:userEmail',async(req,res)=>{

    
    const {userEmail}=req.params
    // console.log(userEmail)

    try {
        
 const todos= await db.query('SELECT * FROM todo where user_email=$1',[userEmail])
 res.json(todos.rows)

    } 
    
    catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Server error');
    }
});

// create a new todo

app.post('/todos',async(req,res)=>{
    
   const{user_email,title,progress,date}= req.body 

   console.log(user_email,title,progress,date)

   const id=uuidv4()
    try {
       const newTodo= await db.query('Insert into todo(id,user_email,title,progess,date) values($1,$2,$3,$4,$5)',
            [id,user_email,title,progress,date]  )


            res.json(newTodo)
    } catch (err) {
        console.error(err)
    }


})

//edit a new todo

app.put('/todos/:id',async(req,res)=>{

    const{id}=req.params
    const{user_email,title,progress,date}=req.body;
    try {

     const editToDo= await db.query('Update todo set user_email=$1,title=$2,progess=$3, date=$4 where id= $5;',[user_email,title,progress,date,id])
        res.json(editToDo)
    } catch (error) {
        console.error(error)
    }

})

// delete a todo


app.delete('/todos/:id',async(req,res)=>{
    const {id}=req.params
    
    try {
    const dlt=  await db.query('Delete from todo where id =$1',[id])
    res.json(dlt)
    
 } catch (error) {
    
    console.error(error)
}

})

//signup

app.post('/signup',async(req,res)=>{

    const{email, password}=req.body
    const salt =bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)
    try{
    const signUp=await db.query('insert into users (email,passwords) values ($1,$2)',[email,hashedPassword])
        
      const token= jwt.sign({email},'secret',{expiresIn:'1hr'})
      res.json({email,token})

    }catch(err){
        console.error(err)
          
        if(err){
            res.json({detail:err.detail})
        }
    }
}


)


//login

app.post('/login',async(req,res)=>{
    const{email, password}=req.body
    try{
    
    const users= await db.query('select * from users where email =$1',[email])
 
       if(!users.rows.length) return res.json({detail:'User does not exist'})

      const success= await bcrypt.compare(password,users.rows[0].passwords)
      const token= jwt.sign({email},'secret',{expiresIn:'1hr'})

      if (success){
        res.json({'email': users.rows[0].email,token})
      }else{
        res.json({detail:"Login failed"})
      }

    }catch(err){
         

        console.error(err)
    }
})


app.listen(port,()=>console.log('Server running on port ' + port))