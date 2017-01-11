import React from "react";
import ReactDOM from 'react-dom';
import $ from 'jquery';

window.onload = () => {
  ReactDOM.render(<DistanceFinder />, document.getElementById('app'));
}



class DistanceFinder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start:"",
      destination:""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <form onSubmit={(event) => {this.handleSubmit(event)}}>
        <label>
          Start:
          <input type="text" onChange={(event)=>{this.setState({start:event.target.value})}} />
        </label>
        <label>
          Destination:
          <input type="text" onChange={(event)=>{this.setState({destination:event.target.value})}} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  handleSubmit(event){
    event.preventDefault();
    let _this = this;

    this.findLatLong(this.state.start).then(function(start) {
      _this.findLatLong(_this.state.destination).then(function(destination){
        let distanceInMiles = _this.calculateDistance(start, destination) * 0.621371;
        if (distanceInMiles <= 20) {
          pushToFirebase();
        } else {
          console.log("Distance is too far away");
        }
      }).catch((status)=>{console.log(status)})
    }).catch((status)=>{console.log(status)});




  }

  // returns [lat,lng]
  findLatLong(address) {
    let geocoder = new google.maps.Geocoder();
    return new Promise(function(resolve, reject) {
      geocoder.geocode({address:address}, function(result, status) {
        if(status == google.maps.GeocoderStatus.OK && result !== undefined) {
          resolve([result[0].geometry.location.lat(), result[0].geometry.location.lng()])
        } else {
          reject(status);
        }
      });
    });


  }

  // takes two [lat,lng] and returns distance in km
  calculateDistance(start, destination) {
    let p1 = new google.maps.LatLng(start[0], start[1]);
    let p2 = new google.maps.LatLng(destination[0], destination[1]);
    return  (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
  }
}
