import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var apiai = require('apiai');
var app = apiai("73a62055c012487b9312db1d7ac7de61");

class App extends Component {

    constructor(props){
        super(props);
        this.test = this.test.bind(this);
    }

    test(){
        console.log("TEST");
        var request = app.textRequest('Next train from Näsby Alle to Täby', {
            sessionId: '1'
        });

        request.on('response', function(response) {
            console.log(response);
        });
     
        request.on('error', function(error) {
            console.log(error);
        });
     
        request.end();

    }

    record(){
        var recognition = new window.webkitSpeechRecognition();
        
        recognition.onstart = function(event) {
                //updateRec();
            };
            recognition.onresult = function(event) {
                var text = "";
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    text += event.results[i][0].transcript;
                }
                console.log(text);
                
            };
            recognition.onend = function() {
            
            };
            recognition.lang = "en-US";
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
                </div>
            </div>
        );
    }
}

export default App;
