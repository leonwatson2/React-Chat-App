import React, { Component } from 'react';
import PropTypes from 'prop-types'

import ChatThread from './ChatThread'
import SideBar from './SideBar'

import { Chat, Message, User } from '../../Classes'
import Messages from '../messaging/Messages'
import MessageInput from '../messaging/MessageInput'
import ChatHeading from './ChatHeading'

export default class ChatContainer extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activeChat:null,
	  	chats:[massChat],
	  };
	}
	componentDidMount() {
		this.setState({activeChat:randomChats[0]})
	}
	
	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
	*/
	sendMessage(chatId, message){
		var { chats } = this.state 
		const sender = this.props.user.name;
		
		const newChats = chats.map((chat)=>{
			if(chat.id === chatId)
				chat.addMessage(new Message({ message, sender }))				
			return chat;
		})
		this.setState({ chats:newChats })
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping(chatId, isTyping){
		var { chats } = this.state 
		const { user } = this.props;
		
		const newChats = chats.map((chat)=>{
			if(chat.id === chatId){
				if(isTyping && !chat.typingUsers.includes(user.name)) 
					chat.addTypingUser(user.name);
				else if(!isTyping && chat.typingUsers.includes(user.name)){
					chat.removeTypingUser(user.name);
				}
			}
			return chat;
		})

		this.setState({ chats:newChats })
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
const fakeMessages = [
		new Message({ message:"Hey Michael", sender:"Bessie McCoy"}),
		new Message({ message:"Hey Amy", sender:"Michael Angelo"}),
		new Message({ message:"Last Message", sender:"Bessie McCoy"})
	]

const massChat = new Chat({name:"Community Chat", messages:fakeMessages})

const randomChats = [
	massChat,
	{
		id:123,
		messages:[{
			id:11,
			message:"Hey Michael",
			sender:"Herbert Furgeson",
			time:new Date("April 7, 1993 14:30"),
			read:true

		},{
			id:1342,
			message:"Hey Herbert",
			sender:"Michael Angelo",
			time:new Date("April 7, 1993 14:45"),
			read:false

		},
		{
			id:132,
			message:"What's Up",
			sender:"Herbert Furgeson",
			time:new Date("April 7, 1993 14:50"),
			read:false

		}],
		users:[{
			id:23,
			name:"Herbert Furgeson"
		},{
			id:24,
			name:"Michael Angelo"
		}],
		typingUsers:[],
		name:"Herbert Furgeson",
	},

	{
		id:125,
		messages:[{
			id:1,
			message:"Hey Michael",
			sender:"Amy Daniel",
			time:new Date("April 7, 1993 14:30"),
			read:true

		},{
			id:1342,
			message:"Hey Amy",
			sender:"Michael Angelo",
			time:new Date("April 7, 1993 14:45"),
			read:true
		},
		{
			id:13,
			message:"What's Up",
			sender:"Amy Daniel",
			time:new Date("April 7, 1993 14:50"),
			read:true

		}],
		users:[{
			id:213,
			name:"Amy Daniel"
		},{
			id:24,
			name:"Michael Angelo"
		}],
		typingUsers:[],
		name:"Amy Daniel"
	},

	{
		id:Math.ceil(Math.random()*450054),
		messages:[{
			id:1,
			message:"Hey Michael",
			sender:"Bessie McCoy",
			time:new Date("April 7, 1993 14:30"),
			read:true

		},{
			id:1342,
			message:"Hey Amy",
			sender:"Michael Angelo",
			time:new Date("April 7, 1993 14:45"),
			read:false
		},
		{
			id:1342,
			message:"What's Up",
			sender:"Bessie McCoy",
			time:new Date("April 7, 1993 14:50"),
			read:false

		}],
		users:[{
			id:213,
			name:"Bessie McCoy"
		},{
			id:24,
			name:"Michael Angelo"
		}],
		typingUsers:[],
		name:"Bessie McCoy"
	},

	{
		id:Math.ceil(Math.random()*4545898),
		messages:[{
			id:1,
			message:"Hey Michael",
			sender:"Daniel Barnett",
			time:new Date("April 7, 1993 14:30"),
			read:true

		},{
			id:1342,
			message:"Hey Amy",
			sender:"Michael Angelo",
			time:new Date("April 7, 1993 14:45"),
			read:false
		},
		{
			id:1342,
			message:"What's Up",
			sender:"Daniel Barnett",
			time:new Date("April 7, 1993 14:50"),
			read:false

		}],
		users:[{
			id:213,
			name:"Daniel Barnett"
		},{
			id:24,
			name:"Michael Angelo"
		}],
		typingUsers:[],
		name:"Daniel Barnett"
	},
	{

			id:Math.ceil(Math.random()*45),
			messages:[{
				id:1,
				message:"Hey Michael",
				sender:"Jim Smith",
				time:new Date("April 7, 1993 14:30"),
				read:true
	
			},{
				id:1342,
				message:"Hey Jim",
				sender:"Michael Angelo",
				time:new Date("April 7, 1993 14:45"),
				read:true
			},
			{
				id:1342,
				message:"What's Up",
				sender:"Jim Smith",
				time:new Date("April 7, 1993 14:50"),
				read:true
	
			}],
			users:[{
				id:213,
				name:"Jim Smith"
			},{
				id:24,
				name:"Michael Angelo"
			}],
			typingUsers:[],
			name:"Jim Smith",
	},{
				id:Math.ceil(Math.random()*45),
				messages:[{
					id:1,
					message:"Hey Michael",
					sender:"Myrtle West",
					time:new Date("April 7, 1993 14:30"),
					read:true
		
				},{
					id:1342,
					message:"Hey Amy",
					sender:"Michael Angelo",
					time:new Date("April 7, 1993 14:45"),
					read:true
				},
				{
					id:1342,
					message:"What's Up",
					sender:"Myrtle West",
					time:new Date("April 7, 1993 14:50"),
					read:true
		
				}],
				users:[{
					id:213,
					name:"Myrtle West"
				},{
					id:24,
					name:"Michael Angelo"
				}],
				typingUsers:[],
				name:"Myrtle West"
	},
	{
				id:Math.ceil(Math.random()*45),
				messages:[{
					id:1,
					message:"Hey Michael",
					sender:"Emma Koskela",
					time:new Date("April 7, 1993 14:30"),
					read:true
		
				},{
					id:1342,
					message:"Hey Amy",
					sender:"Michael Angelo",
					time:new Date("April 7, 1993 14:45"),
					read:true
				},
				{
					id:1342,
					message:"What's Up",
					sender:"Emma Koskela",
					time:new Date("April 7, 1993 14:50"),
					read:true
		
				}],
				users:[{
					id:213,
					name:"Emma Koskela"
				},{
					id:24,
					name:"Michael Angelo"
				}],
				typingUsers:[],
				name:"Emma Koskela"
	},
	{
			id:Math.ceil(Math.random()*45),
			messages:[{
				id:1,
				message:"Hey Michael",
				sender:"Lauri Jarvela",
				time:new Date("April 7, 1993 14:30"),
				read:true
	
			},{
				id:1342,
				message:"Hey Amy",
				sender:"Michael Angelo",
				time:new Date("April 7, 1993 14:45"),
				read:false
			},
			{
				id:1342,
				message:"What's Up",
				sender:"Lauri Jarvela",
				time:new Date("April 7, 1993 14:50"),
				read:false
	
			}],
			users:[{
				id:213,
				name:"Lauri Jarvela"
			},{
				id:24,
				name:"Michael Angelo"
			}],
			typingUsers:[],
			name:"Lauri Jarvela"
		}

]


ChatContainer.propTypes = {
	socket:PropTypes.object,
	user:PropTypes.shape(User).isRequired
}