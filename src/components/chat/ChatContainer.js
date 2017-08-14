import React, { Component } from 'react';
import PropTypes from 'prop-types'

import SideBar from './SideBar'

import { User } from '../../Classes'
import Messages from '../messaging/Messages'
import MessageInput from '../messaging/MessageInput'
import ChatHeading from './ChatHeading'

import { COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT, TYPING } from '../../Constants'

export default class ChatContainer extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activeChat:null,
	  	communityChat:null,
	  	chats:[],
	  };
	  this.resetChat = this.resetChat.bind(this)
	  this.removeSocketEvents = this.removeSocketEvents.bind(this)
	  this.socketEvents = [] //used to deinitialize socket events later
	}

	componentDidMount() {
		const { socket } = this.props
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		this.initSocket()
	}

	componentWillUnmount() {
		this.deinitialize()
	}
	
	/*
	*	Initializes the socket.
	*/	
	initSocket(){
		const { socket } = this.props
		socket.on('connect', ()=>{
			socket.emit(COMMUNITY_CHAT, this.resetChat)
		})
	}

	deinitialize(){
		const { socket } = this.props
		this.removeSocketEvents(socket, this.socketEvents)
	}

	/*
	*	Removes chat event listeners on socket.
	*/
	removeSocketEvents(socket, events){

		if(events.length > 0){
			socket.off(events[0])
			this.removeSocketEvents(socket, events.slice(1))
		}
	}

	/*
	*	Reset the chat back to only the chat passed in.
	* 	@param chat {Chat}
	*/
	resetChat(chat){
		return this.addChat(chat, true)
	}

	/*
	*	Adds chat to the chat container, if reset is true removes all chats
	*	and sets that chat to the main chat.
	*	Sets the message and typing socket events for the chat.
	*	
	*	@param chat {Chat} the chat to be added.
	*	@param reset {boolean} if true will set the chat as the only chat.
	*/
	addChat(chat, reset){
		const { socket } = this.props
		const { chats } = this.state
		const newChats = reset ? [chat] : [...chats, chat]
		
		this.setState({chats:newChats, activeChat:chat})
		
		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(messageEvent, this.addMessageToChat(chat.id))
		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		
		this.socketEvents.push(messageEvent, typingEvent) // used to remove event listerners
	}

	/*
	* Adds message to chat 
	* @param chatId {number}
	*/
	addMessageToChat(chatId){
		return message =>{
			const { chats } = this.state
			let newChats = chats.map((chat) => {
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat;
			})
			this.setState({chats:newChats})
		}
	}

	/*
	*	Updates the typing of chat with id passed in.
	*	@param chatId {number}
	*/
	updateTypingInChat(chatId){
		return ({isTyping, user}) =>{
					if(user !== this.props.user.name){

						const { chats } = this.state
						let newChats = chats.map((chat) => {
							if(chat.id === chatId){
								if(isTyping && !chat.typingUsers.includes(user))
									chat.typingUsers.push(user)
								else if(!isTyping && chat.typingUsers.includes(user))
									chat.typingUsers = chat.typingUsers.filter(u => u !== user)
							}
							return chat;
						})
						this.setState({chats:newChats})
					}
				}
	}

	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
	*/
	sendMessage(chatId, message){
 
		const { socket } = this.props

		socket.emit(MESSAGE_SENT, {chatId, message})
		
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping(chatId, isTyping){

		const { socket } = this.props
		socket.emit(TYPING, {chatId, isTyping})
		
	}

	/*
	*	Set the active the chat of the ChatRoom.
	*	@param {Chat} The chat object to that is active.
	*/
	setActiveChat(chat){
		this.setState({activeChat:chat})
	}

	render() {
		const { user, logout } = this.props 
		const { activeChat, chats } = this.state
		return (
			<div className="container">
				<SideBar 
					logout={logout}
					chats={chats} 
					user={user}
					activeChat={activeChat}
					setActiveChat={ (chat)=> this.setActiveChat(chat) }/>		

				<div className="chat-room-container">
					{
						activeChat !== null ? (
							<div className="chat-room">
								<ChatHeading 
									name={activeChat.name} 
									online={true} />
								<Messages 
									messages={activeChat.messages} 
									user={user} 
									typingUsers={activeChat.typingUsers}/>
								
								<MessageInput 
									sendMessage={
										(message)=>{ 
											this.sendMessage(activeChat.id, message) 
										}
									} 
									sendTyping={
										(isTyping)=>{ 
											this.sendTyping(activeChat.id, isTyping) 
										}
									}
									/>
							</div>
							)
						: 
							<div className="chat-room choose">
								<h3>Choose a chat</h3>
							</div>
					}
				</div>
			</div>
		);
	}
}

ChatContainer.propTypes = {
	socket:PropTypes.object,
	user:PropTypes.shape(User).isRequired
}