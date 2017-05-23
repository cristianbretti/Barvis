import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var apiai = require('apiai');
var app = apiai("73a62055c012487b9312db1d7ac7de61");



class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            inputString: "",
            from: "",
            to: ""
        }
        this.aiQuery = this.aiQuery.bind(this);
        this.record = this.record.bind(this);
    } 


    aiQuery (aiQueryText) {
        var that = this;
        this.setState({inputString: aiQueryText});

        var request = app.textRequest(aiQueryText, {
            sessionId: '1'
        });

        request.on('response', function(response) {
            console.log(response);
            var fromLocation = response.result.parameters.from;
            var toLocation = response.result.parameters.to;

            that.setState({from: fromLocation, to: toLocation});
        });
     
        request.on('error', function(error) {
            console.log(error);
        });
     
        request.end();
}

    record(){
        var that = this;
        var recognition = new window.webkitSpeechRecognition(this);
        
        recognition.onstart = function(event) {
                //updateRec();
        };

        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            console.log(text);
            that.aiQuery(text);
        };
        recognition.lang = "sv-SE";
        recognition.start();
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <div>
                    <button onClick={this.record}>Start Recording</button>
                    <h2>{this.state.inputString}</h2>
                    <h3>{"Från: " + this.state.from}</h3>
                    <h3>{"Till: " + this.state.to}</h3>
                </div>
            </div>
        );
    }
}

export default App;
