const address = process.argv[2]
const port = process.argv[3]

const datagram = require('dgram');
const server = datagram.createSocket("udp4");

let clients = new Map();

server.on("error",(err)=>{
    console.log("Server error: ",err.stack);
    server.close();
})

server.on("listening",()=>{
    console.log(`Server is running on ${address}:${port}`);
})

server.on("message",(msg,rinfo)=>{
    console.log("Incoming message:",msg.toString().trim());
    
    if(!clients.has(rinfo.port)){
        clients.set(rinfo.port,rinfo.address);
    }
})

process.stdin.on("data",(data)=>{
    if(data.toString().trim() == "exit"){
        return process.exit();
    }

    if(clients.size > 0){
        clients.forEach((add,port)=>{
            server.send(data,port,add);
        })
    }
})


server.bind(port,address);