const io=require("socket.io")(8900,{
    cors:{
        origin:"https://radiant-pony-c7001b.netlify.app/"
    }
})


let users=[]

function add(userId,socketId){
    !users.some((user)=>user.userId===userId)&&
    users.push({userId,socketId})
}

function remove(socketId){
    return users= users.filter((user)=>user.socketId!==socketId)
}

function finduser(receiverId){
    return users.find((item)=>item.userId===receiverId)

}

io.on("connect",(socket)=>{
    console.log("User Connected")
    socket.on("adduser",(user)=>{
        add(user,socket.id)
        io.emit("getusers",users)
        console.log(user)
        console.log(users)

    })


    socket.on("addmessage",({senderId,receiverId,message})=>{
        console.log({senderId,receiverId,message})
       const user= finduser(receiverId)
       io.to(user?.socketId).emit("getmessage",{
        senderId,message
       })

    })
    
    socket.on("disconnect",()=>{
        console.log("user disconnected")
        remove(socket.id)
        io.emit("getusers",users)
    })
})





