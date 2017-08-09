const uuidv4 = require('uuid/v4');

/*
*	@prop id {string}
*	@prop name {string}
*	@param {object} 
*		name {string}
*/
const createUser = ({name})=>(
	 {
		id: uuidv4(),
		name
	}
)

/*
*	Creates a messages object.
* 	@prop id {string}
* 	@prop time {Date} the time in 24hr format i.e. 14:22
* 	@prop message {string} actual string message
* 	@prop sender {string} sender of the message
*	@param {object} 
*		message {string}
*		sender {string}
*/
const createMessage = ({message, sender})=>{
	return {
		id: uuidv4(),
		time: getTime(new Date(Date.now())),
		message: message,
		sender: sender
	}
} 

/*
*	Creates a Chat object
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
const createChat = ({messages = [], name="Community", users=[]} = {})=>(
	{
		id: uuidv4(),
		name,
		messages,
		users,
		typingUsers: [],

		addMessage: (messages, message)=>{
			return [...messages, message]
		},
		addTypingUser: (typingUsers, username)=>{
			return [...typingUsers, username]
		},
		removeTypingUser: (typingUsers, username) => {
			return typingUsers.filter((u)=>u === username)

		}
	}
)

const getTime = (date)=>{
		return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
	}

module.exports = {
	createChat,
	createMessage,
	createUser
}