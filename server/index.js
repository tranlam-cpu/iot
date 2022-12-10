
require('dotenv').config()
const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const houseRouter = require('./routes/House')
const authRouter = require('./routes/auth')

const connectDB = async ()=>{
    try{
        await mongoose.connect(`mongodb+srv://admin:admin@cluster0.ohm2udb.mongodb.net/?retryWrites=true&w=majority`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected')
    }catch (error){
        console.log(error.message)
        process.exit(1)
    }
}

connectDB();

const app=express()
app.use(express.json())
app.use(cors())
app.use('/api/house', houseRouter);
app.use('/api/auth', authRouter);
const PORT = process.env.PORT || 5000



const server=app.listen(PORT,()=> console.log(`Server started on port ${PORT}`))

/*const io = require('socket.io')(server,{
    cors: {origin: "*"}
});*/
const io = require('./socket.js').init(server);



io.on('connection',(socket)=>{
    console.log('client-connect');



    socket.on('sendmess',(data)=>{
        module.exports=data;
    })


    socket.on('disconnect',()=>{
        console.log('client disconnect');
    })
});




