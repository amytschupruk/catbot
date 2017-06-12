import React from 'react';
import ReactDOM from 'react-dom';
import CatBotMessages from './catbotMessages.js';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBej-7CtDNDJLGEIHw4tTdpuGSwSwSaivQ",
  authDomain: "catbot-29276.firebaseapp.com",
  databaseURL: "https://catbot-29276.firebaseio.com",
  projectId: "catbot-29276",
  storageBucket: "catbot-29276.appspot.com",
  messagingSenderId: "545740898558"
};
firebase.initializeApp(config);

const auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();

// const dbRef = firebase.database().ref('/');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			userMessage: '',
			convo: [],
    		user: null,
			loggedIn: false
		}
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
		.then((result) => {
			const user = result.user;
			this.setState({
				user: user,
				loggedIn: true
			})
		})
	}
	logout() {
		auth.signOut()
		.then(() => {
			this.setState({
				user: null,
				loggedIn: false
			})
		});
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		//userMessage = where items will be stored
		const userChatRef = firebase.database().ref('convo')
		//messages to be stored
		const message = {
			content: this.state.userMessage,
			response: CatBotMessages[Math.floor(Math.random() * CatBotMessages.length)]
		}
		//updating message to Firebase
		userChatRef.push(message);
		//clear user input for subsequent message entry 
		this.setState({
			userMessage: ''
		});
	}
    render() {
    	const showChat = () => {
    		if(this.state.loggedIn) {
    			return (
    				<div>
						<header>
							<h2>Chat with a real live catbot!</h2>
							<button className="logout" onClick={this.logout}>Log Out</button>
						</header>
						<div className="chat-container">
							<section className="messages-container">
									 {this.state.convo.map((userMessage) => { 
										return (
											<div>
												<div className="user-single-message-container">
													<p className="userMessage">{userMessage.content || null}</p>
												</div>
												<div className="catbot-single-message-container">
													<p className="catbotMessage">{userMessage.response.catbotMessage || null}</p>
												</div>
												
											</div>
										)
									})} 
							</section>
							<section className="user-input-container">
								<form onSubmit={this.handleSubmit}>
									<input type="text" name="userMessage" placeholder="Write a message to Catbot." onChange={this.handleChange} value={this.state.userMessage} />
									<button>Send</button>
								</form>
							</section>
						</div> 
    				</div>
    			)
    		}
    		else {
    			<h2>Chat with a real live catbot!</h2>
    			return <button onClick={this.login}>Log In</button>
    		}
    	}
      return (
        <div className="catbot-app-container">
	        <div className="chat-section">
	        	{showChat()}
		    </div>	
		    <div className="aside-section">   	
		        <section className="logo-img-container">
		        	<h1>CATBOT!!!!!</h1>
		        	<img src="http://www.bharatint.com/img/categories/our-cat-shop-image.png" alt=""/>
		        </section>
		    </div>    	          
        </div>
      )
    }
    componentDidMount() {
	    firebase.auth().onAuthStateChanged((user) => { //this checks to see if user logged in
	    	if (user) {
	    			console.log(user);
	    			this.setState({
	    				user: user,
	    				loggedIn: true
			    	});
			    	// taking updated user data and storing 
			    	const userChatRef = firebase.database().ref('convo');
			    	userChatRef.on('value', (newMessage) => {
			    		// array for new messages
			    		let newMessages = [];
			    		let convo = newMessage.val();
			    		for (let key in convo) {
			    			newMessages.push(convo[key]);
			    		}
			    		console.log(newMessages);
				    	this.setState({
				    		convo: newMessages
				    	});
					});
		    } else {
				console.log('User is not logged in');
				this.setState({
					user: null,
					loggedIn: false
				});
			}
		});	
	}
}

ReactDOM.render(<App />, document.getElementById('app'));

// JSON.stringify
//set timeout