import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var apiai = require('apiai');
var app = apiai("73a62055c012487b9312db1d7ac7de61");
var axios = require('axios');

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            resultString: "",
            inputString: "",
            from: "",
            to: ""
        }
        this.aiQuery = this.aiQuery.bind(this);
        this.record = this.record.bind(this);
        this.slQueryLocation = this.slQueryLocation.bind(this);
        this.slQueryGetID = this.slQueryGetID.bind(this);
    } 


    record(){
        var that = this;
        var recognition = new window.webkitSpeechRecognition(this);

        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            that.aiQuery(text);
        };

        recognition.lang = "sv-SE";
        recognition.start();
    }

    aiQuery (aiQueryText) {
        var that = this;
        this.setState({inputString: aiQueryText});

        var request = app.textRequest(aiQueryText, {
            sessionId: '1'
        });

        request.on('response', function(response) {
            var fromLocation = response.result.parameters.from;
            var toLocation = response.result.parameters.to;

            that.slQueryLocation(fromLocation, toLocation);
            that.setState({from: fromLocation, to: toLocation});
        });
     
        request.on('error', function(error) {
            console.log(error);
        });
     
        request.end();
    }

    slQueryLocation(fromLocation, toLocation){
        var that = this;
        axios.all([this.slQueryGetID(fromLocation),
                  this.slQueryGetID(toLocation)]).then(axios.spread((fromIdResponse, toIdResponse) => {
            
            var originId = fromIdResponse.data.StopLocation[0].id;
            var destId = toIdResponse.data.StopLocation[0].id;
            
            axios("https://api.resrobot.se/v2/trip",{
                params: {
                    key: "023a355b-7eed-4ac4-bad5-90883dba1ef8",
                    originId: originId,
                    destId: destId,
                    format: "json"
                }
            }).then(tripResponse => {
                console.log(tripResponse);
                var firstTripFirstLeg = tripResponse.data.Trip[0].LegList.Leg[0];
                var resultString = "Linje: " + firstTripFirstLeg.transportNumber +
                " Tid: " + firstTripFirstLeg.Origin.time + " Mot: " + firstTripFirstLeg.direction;
                that.setState({resultString: resultString});
            })
        }));
    }

    slQueryGetID(locationString){
        return axios("https://api.resrobot.se/v2/location.name",{
            params: {
                key: "023a355b-7eed-4ac4-bad5-90883dba1ef8",
                input: locationString,
                format: "json"
            }
        })
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
                    <h2>{this.state.resultString}</h2>
                </div>
            </div>
        );
    }
}

export default App;
