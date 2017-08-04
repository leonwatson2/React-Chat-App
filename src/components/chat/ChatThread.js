/*
*	ChatThread container for the chat room.
*/
import React, { Component } from 'react';

export default class ChatThread extends Component {

	render() {
		return (
			<div className="chat-room-container">
				{this.props.children}
			</div>
		);
	}
}
