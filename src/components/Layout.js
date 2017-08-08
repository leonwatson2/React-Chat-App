import React, { Component } from 'react';
import LoginForm from './LoginForm'
import ChatContainer from './chat/ChatContainer'
import { USER_CONNECTED, LOGOUT } from '../Constants'

var serverURI = process.env.REACT_APP_SERVER 
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
	  this.reconnectUserInfo = this.reconnectUserInfo.bind(this)
	}

	componentWillMount() {
		
		var socket = io(serverURI)
		this.setState({ socket })
		this.initSocket(socket)
	}
	
	/*
	*	Initializes socket event callbacks
	*/
	initSocket(socket){
		socket.on('connect', (value)=>{
			console.log("Connected");
		})
		socket.on('disconnect', this.reconnectUserInfo)
	}

	/*
	*	Connectes user info back to the server.
	*	If the user name is already logged in.
	*/
	reconnectUserInfo(){
		const { socket, user } = this.state

		if(this.state.user != null){
			
			socket.emit(USER_CONNECTED, user)
		}

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
		const { socket } = this.state
		socket.emit(LOGOUT)
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
					<ChatContainer socket={socket} logout={this.logout} user={user}/>
				}
				
			</div>
		);
	}
}

