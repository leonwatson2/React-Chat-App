import React, { Component } from 'react';
import Messages from '../messaging/Messages'
import MessageInput from '../messaging/MessageInput'
import ChatHeading from './ChatHeading'

export default class ChatThread extends Component {
	render() {
		const { chat, user, sendMessage, sendTyping } = this.props
		return (
			<div className="chat-room-container">
				{
			chat !== null ? (
				<div className="chat-room">
					<ChatHeading name={chat.name} online={true} />
					<Messages messages={chat.messages} user={user} typingUsers={chat.typingUsers}/>
					<MessageInput sendMessage={sendMessage} sendTyping={sendTyping}/>
				</div>
				)
			: 
			<div className="chat-room choose">
				<h3>Choose a chat</h3>
			</div>
			
			}
			</div>
		);
	}
}
