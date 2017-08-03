import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'

export default class Messages extends Component {
	
	constructor(props) {
	  super(props);
	  this.scrollDown = this.scrollDown.bind(this)
	}
	
	getTime(date){
		return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
	}

	scrollDown(){
		var { container } = this.refs
		container.scrollTop = container.scrollHeight
	}
	
	//Life Cycles
	componentDidUpdate(newProps){
		this.scrollDown();

	}

	componentDidMount(){
		this.scrollDown();
	}

	render() {
		const { messages, user, typingUsers } = this.props;
		return (
			<div ref={'container'} 
					className="thread-container">
					<div className="thread">
					{
						messages.map((mes, i)=>{
							return( 
							<div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
								<div className="time">{mes.time ? this.getTime(mes.time) : null}</div>
								<div className="message">{mes.message}</div>
							</div>)
						})
						
					}
					{
						typingUsers.map((name)=>{
							return(
								<div key={name} className="typing-user">
								{`${name} is typing . . .`}
								</div>
								)
						})
					}

					</div>
			</div>
		);
	}
}

