import React, { Component } from 'react';

export default class MessageInput extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = { message:"", isTyping:false};
	  this.handleSubmit = this.handleSubmit.bind(this)
	  this.sendMessage = this.sendMessage.bind(this) 
	}

	/*
	*	Handles submitting of form.
	*	@param e {Event} onsubmit event
	*/
	handleSubmit(e){
		e.preventDefault()
		this.sendMessage()
		this.setState({message:""})
	}
	
	/*
	*	Send message to add to chat.
	*/
	sendMessage(){

		this.props.sendMessage({
			id:Math.ceil(Math.random()*45321),
			message:this.state.message,
			read:true,
			time:new Date(Date.now())
		})
	}
	
	/*
	*	Starts/Stops the interval for checking 
	*/
	sendTyping(){
		const { sendTyping } = this.props
		this.lastUpdateTime = Date.now()
		if(!this.state.isTyping){
			this.setState({isTyping:true})
			sendTyping(true)
			this.startCheckingTyping()
		}
	}

	/*
	*	Start an interval that check if the user is typing
	*/
	startCheckingTyping(){
		this.typingInterval = setInterval(()=>{
			
				if((Date.now() - this.lastUpdateTime) > 300){
					const { sendTyping } = this.props
					this.setState({isTyping:false})
					sendTyping(false)
					this.stopCheckingTyping()
				}
			}, 300)
	}

	/*
	*	Stops the interval from checking if the user is typing
	*/
	stopCheckingTyping(){
		clearInterval(this.typingInterval)
	}

	render() {
		const { message } = this.state
		const { sendTyping } = this.props
		return (
			<div className="message-input">
					<form ref={(form)=>{this.form = form}} 
						onSubmit={this.handleSubmit}
							className="message-form">
						
						<input 
							id="message"
							type="text" 
							className="form-control"
							value = { message } 
							
							autoComplete={'off'}
							placeholder="Type something to send"
							onKeyUp={(e)=>{ e.keyCode !== 13 && this.sendTyping() }}
							onChange = {
								({target:{value:v}})=>{
									this.setState({message:v})
								}
							}/>
						<button 
							disabled={ message.length < 1} 
							type="submit" 
							className="send">Send
						</button>
					</form>
				</div>
				
		);
	}
}
