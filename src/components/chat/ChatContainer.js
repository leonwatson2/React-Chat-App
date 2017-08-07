import React, { Component } from 'react';
import PropTypes from 'prop-types'

import ChatThread from './ChatThread'
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
		socket.emit(COMMUNITY_CHAT)
		this.initSocket()
	}

	componentWillUnmount() {
		this.deinitialize()
	}
		
	initSocket(){
		const { socket } = this.props
		socket.on(COMMUNITY_CHAT, this.resetChat)
	}

	deinitialize(){
		const { socket } = this.props

		socket.off(COMMUNITY_CHAT)
		this.removeSocketEvents(socket, this.socketEvents)
	}

	removeSocketEvents(socket, events){

		if(events.length > 0){
			socket.off(events[0])
			this.removeSocketEvents(socket, events.slice(1))
		}
	}
	/*
	*	Gets the community chat and sets 
	*	message recieve event for
	* 	@param chat {Chat}
	*/
	resetChat(chat){
		
		const { socket } = this.props
		const { chats } = this.state
		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		this.setState({chats:[chat], activeChat:chat})
		
		socket.on(messageEvent, this.addMessageToChat(chat.id))
		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		
		this.socketEvents.push(messageEvent, typingEvent)

	}

	addChat(chat){
		const { socket } = this.props
		const { chats } = this.state
		this.setState({chats:[...chats, chat], activeChat:chat})
		socket.on(`${MESSAGE_RECIEVED}-${chat.id}`, this.addMessageToChat(chat.id))
	}

	/*
	* Adds message to chat 
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

				<ChatThread 
					chat={activeChat} 
					user={user}>
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
				</ChatThread>
			</div>
		);
	}
}




ChatContainer.propTypes = {
	socket:PropTypes.object,
	user:PropTypes.shape(User).isRequired
}