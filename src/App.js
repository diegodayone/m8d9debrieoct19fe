import React from 'react';
import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"

class App extends React.Component {

  socket = null;

  state = {
    text: "",
    username: "",
    to: "",
    messages: []
  }

  sendBroadcast = () =>{
    this.socket.emit("broadcast", this.state.text)
  }

  sendPrivate = () =>{
    this.socket.emit("private", {
      text: this.state.text,
      from: this.state.username,
      to: this.state.to
    })
  }

  sendLogin = () =>{
    this.socket.emit("login", this.state.username)
  }

  componentDidMount = () => {
    this.socket = io("http://localhost:8080", {
      transports: ["websocket"]
    })

    this.socket.on("broadcast", message => {
      this.setState({
        messages: this.state.messages.concat(message),
        text: ""
      })
      console.log(message)
    })

    this.socket.on("private", message => {
      this.setState({
        messages: this.state.messages.concat("P - " + message.from + " --> " + message.text),
        text: ""
      })
      console.log(message)
    })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
        <input type="text" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value})} />
          <input type="button" value="set username" onClick={this.sendLogin} />

          <div>
            {this.state.messages.map((m,i) => <div key={i}> {m} </div>)}
          </div>

          <input type="text" value={this.state.text} onChange={(e) => this.setState({ text: e.target.value})} />
          <input type="text" placeholder="receiver" value={this.state.to} onChange={(e) => this.setState({ to: e.target.value})} />
          <input type="button" value="submit private" onClick={this.sendPrivate} />
          <input type="button" value="submit broadcast" onClick={this.sendBroadcast} />
        </header>
      </div>
    );
  }
}

export default App;
