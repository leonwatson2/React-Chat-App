import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { VERIFY_USER } from '../Constants'

export default class LoginForm extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = { nickname: "Love" };

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.setUser = this.setUser.bind(this);
	}

	componentDidMount(){
		this.focus()
		this.initSocket()
	}

	initSocket(){
		const { socket } = this.props

		socket.on(VERIFY_USER, this.setUser)

	}

	setUser(response){
		if(!response.isUser){
			this.props.setUser(response.user)
			this.props.socket.off(VERIFY_USER, this.setUser)
		}
		else{
			this.setError("User name taken.")
		}

	}

	setError(error){
		console.error(error);
	}

	//updates form inputs
	handleChange(event){
		this.setState({ nickname:event.target.value })
	}

	//Sends emit to socket for verification 
	handleSubmit(event){
		event.preventDefault()
		const { socket } = this.props
		const { nickname } = this.state
		socket.emit(VERIFY_USER, nickname)
		
	}
	

	focus(){
		this.textInput.focus()
	}

	render() {
		const { nickname } = this.state 
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form">

			          <label 
			          		className="col s12" 
			          		htmlFor="nickname">
			          		<h1 style={{textAlign:"center"}}>
			          			Got a nickname?
			          		</h1>
			          </label>
			          
			          <input 
			          		ref={(input)=>{ this.textInput = input }}
			          		id="nickname" 
			          		className="col s12" 
			          		type="text"
			          		value={nickname}
			          		onChange={this.handleChange}
			          		placeholder={this.randomPlaceholder()} 
			          		/>
				</form>
			</div>
		);
	}
	
	randomPlaceholder(){
		const randNames = ["VeryCleverNickNameThatsProbablyAlreadyTaken", "Rocket69", "MadDog33", "L4ser9374", "UmmmMyName134", "YouDontNayOmi","SimpleName", "SexyCat99", "LightYear111"]
		return randNames[Math.floor(Math.random()*3000) % randNames.length]
	}
}

LoginForm.propTypes = {
	socket: PropTypes.object,
	verified:PropTypes.func.isRequired
}
