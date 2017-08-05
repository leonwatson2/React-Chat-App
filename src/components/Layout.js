import React, { Component } from 'react';
import LoginForm from './LoginForm'
import ChatContainer from './chat/ChatContainer'
import { USER_CONNECTED } from '../Constants'

var io = require('socket.io-client')

export default class Layout extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  		socket:null, 
	  		user:null
		};
	  this.setUser = this.setUser.bind(this)
	  this.logout = this.logout.bind(this)
	}

	componentWillMount() {
		var socket = io('http://68.191.211.185:3231')
		this.setState({ socket })
		this.initSocket(socket)
	}
	
	initSocket(socket){
		socket.on('connect', (value)=>{
			console.log("Connected");
		})
		socket.on('disconnect', (value)=>{
			console.log("Disconnected");
		})
	}

	/*
	*	Sets the current user logged in
	*	@param user an object {id:number, name:string}
	*/
	setUser(user){
		const { socket } = this.state
		this.setState({user});
		socket.emit(USER_CONNECTED, user)
	}
	
	/*
	*	Sets the user to null.
	*/
	logout(){
		this.setState({user:null})
	}
	render() {
		const { user, socket } = this.state 

		return (
			<div className="container">
				
				{	
					!user ? 
					<LoginForm socket={socket} setUser={this.setUser} verified={ this.setUser }/>
					: 
					<ChatContainer logout={this.logout} user={user}/>
				}
				
			</div>
		);
	}
}
