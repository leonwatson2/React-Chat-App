const io = require('./server.js').io
const { 
  COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT, 
  USER_CONNECTED, USER_DISCONNECTED, TYPING, 
  STOP_TYPING, VERIFY_USER, LOGOUT
        } = require('../Constants')
const { User, Chat, Message } = require('../Classes')

let communityChat = new Chat({name:"Community", messages:[]})

let connectedUsers = {};

let chats = [communityChat];


module.exports = function(socket){
  

  let sendMessageToChatFromUser;
  let sendTypingFromUser;
  
  //Verify Username 1
  socket.on(VERIFY_USER, function(newUser){
    if(!isUser(connectedUsers, newUser)){
      
      io.to(socket.id).emit(VERIFY_USER, {isUser:false, user:new User({name:newUser})})

    }else{
     
      io.to(socket.id).emit(VERIFY_USER, {isUser:true})

    }
  })

  //user connects 2
  socket.on(USER_CONNECTED, function(user){
    
    addUser(connectedUsers, user)
    socket.user = user.name;
    sendMessageToChatFromUser = sendMessageToChat(user.name)
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)

  })


  //user disconnects 3
  socket.on('disconnect', function (){
    if(!!socket.user){
      removeUser(connectedUsers, socket.user)
      
      io.emit(USER_DISCONNECTED, connectedUsers)
    }
    
  })

  //user logout 4
  socket.on(LOGOUT, function(){
    removeUser(connectedUsers, socket.user)
  })

  //send community chat
  socket.on(COMMUNITY_CHAT, function(){

    io.to(socket.id).emit(COMMUNITY_CHAT, communityChat)
  })

  //user sends message
  socket.on(MESSAGE_SENT, function({chatId, message}){
    sendMessageToChatFromUser(chatId, message)
  })

	//add user to typing users on chatId
  socket.on(TYPING, function({chatId, isTyping}){
   
    sendTypingFromUser(chatId, isTyping)
  })

}

function sendMessageToChat(sender){

   return (chatId, message) => {
                io.emit(`${MESSAGE_RECIEVED}-${chatId}`, new Message({message, sender}))
              }
} 

function sendTypingToChat(user){

  return (chatId, isTyping)=>
            {
                io.emit(`${TYPING}-${chatId}`, {user, isTyping})
            }
}



function addUser(userList, user){
  userList[user.name] = user
}

function removeUser(userList, username){
  delete userList[username]

}

function isUser(userList, username){
  let res = !!userList[username]
  return res
}

function createError(message){
  return {
    error:{
      message
    }
  }
}
