const uuidv4 = require('uuid/v4');

/*
*	@constructor User
*	@prop id {string}
*	@prop name {string}
*	@param {object} 
*		name {string}
*/
function User({name}){
	this.id = uuidv4()
	this.name = name
}

/*
*	@constructor Message
* 	@prop id {string}
* 	@prop time {Date}
* 	@prop message {string}
* 	@prop sender {string}
* 	@prop getTime {function} returns the Date of message in 24hr time format
*	@param {object} 
*		message {string}
*		sender {string}
*/
function Message({message, sender}){
	this.id = uuidv4()
	this.time = getTime(new Date(Date.now()))
	this.message = message
	this.sender = sender

	
} 

/*
*	@constructor Chat
* 	@prop id {string}
* 	@prop name {string}
* 	@prop messages {Array.Message}
* 	@prop users {Array.string}
*	@prop addMessage {function} adds message to chat.
*	@prop addTypingUser {function} adds a username to typing users of chat.
*	@prop removeTypingUser {function} removes a username to typing users of chat.
*	@param {object} 
*		messages {Array.Message}
*		name {string}
*		users {Array.string}
* 
*/
function Chat({messages = [], name="", users=[]}){
			
	this.id = uuidv4()
	this.name = name
	this.messages = messages
	this.users = users
	this.typingUsers = []

	this.addMessage = (message)=>{
		this.messages.push(message)
	}
	this.addTypingUser = (username)=>{
		this.typingUsers.push(username)
	}
	this.removeTypingUser = (username) => {
		this.typingUsers.splice(this.typingUsers.indexOf(username), 1)

	}
}

const getTime = (date)=>{
		return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
	}

module.exports = {
	Chat,
	Message,
	User
}