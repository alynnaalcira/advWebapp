import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            myImg:require("./imgs/1.png"),
            myImg2:require("./imgs/2.png"), 
            allusers:[],
            myId:null
        }
        
        this.handleImage = this.handleImage.bind(this);
    }
    
    componentDidMount(){
        //connect to socket server
        this.socket = mySocket("https://advsockets.herokuapp.com/");
        
        //when server sends sockets a message "userjoined", send this data
        this.socket.on("userjoined", (data)=>{
            this.setState({
                allusers:data
            })
        });
        
        this.socket.on("yourid", (data)=>{
           this.setState({
               myId:data
           }) 
        });
        
        this.socket.on("newmove", (data)=>{
            console.log(data);
           this.refs["u"+data.id].style.left = data.x; 
           this.refs["u"+data.id].style.top = data.y; 
           this.refs["u"+data.id].src = data.src; 
        });
        
        this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
            if(this.state.myId === null){
                return false; //if theres no id, FAIL
            }
            
            this.refs["u"+this.state.myId].style.left = ev.pageX + "px";
            this.refs["u"+this.state.myId].style.top = ev.pageY + "px";
            
            //sending stuff over to socket
            this.socket.emit("mymove", {
                x:ev.pageX,
                y:ev.pageY,
                id:this.state.myId,
                src:this.refs["u"+this.state.myId].src
            })
        });   
    }
    
    handleImage(evt){
        this.refs["u"+this.state.myId].src = evt.target.src;
    }
    
  render() {
      var allimgs = this.state.allusers.map((obj, i)=>{
          return (
            <img ref={"u"+obj} className="allImgs" src={this.state.myImg} height={100} key={i} />
          )
      });
      
    return (
      <div className="App">
            <div ref="thedisplay" className="display">
                {allimgs}
            </div>
            <div className="controls">
                {this.state.myId}
                <img src={this.state.myImg} height={50} onClick={this.handleImage} />
                <img src={this.state.myImg2} height={40} onClick={this.handleImage} />
            </div>
      </div>
    );
  }
}

export default App;
