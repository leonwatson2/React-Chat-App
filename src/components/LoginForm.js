import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { User } from '../Classes'

export default class LoginForm extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = { nickname: '', socket: props.socket };

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.verify = this.verify.bind(this)
	}

	componentDidMount(){
		this.focus()
	}

	//uses the response from the server to verify user
	verify(user){
		if(!user.error){	
			this.props.verified(user)
		}else{
			console.log(user.error.message);
		}
	}

	//updates form inputs
	handleChange(event){
		this.setState({ nickname:event.target.value })
	}

	//Sends emit to socket for verification 
	handleSubmit(event){
		event.preventDefault()
		const { nickname } = this.state
		if(this.isValidName(nickname)){
			this.props.setUser(new User({name:nickname}))
		}else{
			console.log("Not long enough name");
		}
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
