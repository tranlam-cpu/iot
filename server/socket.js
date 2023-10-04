
let io;
module.exports = {
   init: (server) => {
    io =require('socket.io')(server,{
        cors: {origin: "*"}
    });
    return io;
   },
   get: ()=> {
       if (!io) {
          console.log(io)
       }else{
        console.log('ok');
        return io;
       }
       
   }
}