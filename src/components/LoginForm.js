import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { User } from '../Classes'
import { VERIFY_USER } from '../Constants'

export default class LoginForm extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = { nickname: '' };

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
		const { nickname } = this.state
		if(!response.isUser) 
			this.props.setUser(new User({name:nickname}))
		else{
			this.setError("User name taken.")
		}
		this.props.socket.off(VERIFY_USER, this.setUser)

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
	
	//check if the username is valid
	isValidName(name){
		if(name.length > 0){
			return true
		}
		return false
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
