import logo from './logo.svg';
import './App.css';
import React from 'react';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import AutoComplete from 'react-google-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

Geocode.setApiKey("AIzaSyAhxzVTBxBnRaIMbQaNX-sT0MzN0mORWdo")

class App extends React.Component {

  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 10,
    height: 600,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    }
  }


  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          mapPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          markerPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        }, () => {
          Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
          .then(response => {
          console.log('response',response)
          const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray)

            this.setState({
              address: (address) ? address : "",
              area: (area) ? area : "",
              city: (city) ? city : "",
              state: (state) ? state : "",
            })   
          })
        })
      })
    }
  }

  getCity = (addressArray) => {
      let city = '';
      for (let index = 0; index < addressArray.length; index++){
        if(addressArray[index].types[0] && 'administrative_area_level_2' === addressArray[index].types[0]){
          city = addressArray[index].long_name;
          return city;
        }
      }
  }

  getArea = (addressArray) => {
    let area = '';
    for (let index = 0; index < addressArray.length; index++) {
      if(addressArray[index].types[0]) {
        for (let j = 0; j < addressArray.length; j++) {
        if('sublocality_level_1' === addressArray[index].types[j] || 'locality' === addressArray[index].types[j]) {
          area = addressArray[index].long_name;
          return area;
        }
        }
      }
    }
  }

   getState = (addressArray) => {
    let state = '';
    for (let index = 0; index < addressArray.length; index++) {
        for (let index = 0; index < addressArray.length; index++) {
        if(addressArray[index].types[0] && 'administrative_area_level_1' === addressArray[index].types[0]) {
          state = addressArray[index].long_name;
          return state;
        }
      }
    }
  } 

  onMarkerDragEnd = (event) => {
  let newLat = event.latLng.lat();
  let newLng = event.latLng.lng();

  Geocode.fromLatLng(newLat, newLng)
  .then(response => {
    console.log('response',response)
    const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray)

       this.setState({
         address: (address) ? address : "",
         area: (area) ? area : "",
         city: (city) ? city : "",
         state: (state) ? state : "",
         markerPosition: {
           lat: newLat,
           lng: newLng
         },
         MapPosition: {
          lat: newLat,
          lng: newLng
         },
       })   
    })
  }

  onPlaceSelected = (place) => {
    const address = place.formatted_address,
    addressArray = place.address_components,
    city = this.getCity(addressArray),
    area = this.getArea(addressArray),
    state = this.getState(addressArray),
    newLat = place.geometry.location.lat(),
    newLng = place.geometry.location.lng();
    this.setState({
      address: (address) ? address : "",
      area: (area) ? area : "",
      city: (city) ? city : "",
      state: (state) ? state : "",
      markerPosition: {
        lat: newLat,
        lng: newLng
      },
      MapPosition: {
       lat: newLat,
       lng: newLng
      },
    })
  }


  handleSubmit(event) {
    event.preventDefault()
    var fName = event.target[0].value;
    var lName = event.target[1].value;
    var div = document.getElementById('InfoWindow');
    div.innerHTML += ""+fName + " " + lName
  }
  render() {

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      >
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        >
          <InfoWindow>
          <div id="InfoWindow"></div>
          </InfoWindow>
          </Marker>
          
          <AutoComplete
          style={{width:'80%',height:'4rem;',paddingLeft:'16px',marginTop:'0.5rem',marginBottom:'2rem',visibility:'hidden'}}
          types={['(regions)']}
          onPlaceSelected= {this.onPlaceSelected}
          />
      </GoogleMap>
    ));
    return (
    <div style={{height:'1150px',width:'100%'}}>
      <div id="TextBox" style={{alignItems:'center',textAlign:'center',backgroundColor:'#9beae4',height:'100%',paddingTop:'8%'}}>
        <div id="formStart" style={{width:'45%',backgroundColor:'white',borderRadius:'8px',paddingTop:'2rem',paddingBottom:'2rem',marginLeft:'27%'}}>
        <div style={{width:'80%',paddingLeft:'14%'}}>
        <h2 style={{fontSize:'35px',borderBottom:'1px solid #e9e9ec',textAlign:"initial",paddingBottom:'1rem'}}>ONQOR Code Test</h2>
        </div>
        <div id="names" style={{width:'100%'}}>
          <form  onSubmit = {this.handleSubmit} style={{paddingBottom:'1rem',paddingTop:'1rem'}}>
          <input type="text" id="fname" placeholder="Name" style={{width:'35%',marginBottom:'0.5rem',marginRight:'1.5rem',height:'2.5rem',fontSize:'18px',borderRadius:'5px'}}></input>
          <input type="text" id="lname" placeholder="Family Name" style={{width:'35%',marginBottom:'0.5rem',height:'2.5rem',fontSize:'18px',borderRadius:'5px'}}></input><br></br>
          <AutoComplete
            style={{width:'73%',marginTop:'1rem',height:'3rem',fontSize:'18px',borderRadius:'5px'}}
            types={['(regions)']}
            //placeholder="Test Flat, Example Road,London,N42GQ"
            onPlaceSelected= {this.onPlaceSelected}
            /><br></br>
          <input type="submit" value="Submit" style={{backgroundColor:'#00aeef',width:'6rem',height:'2.5rem',borderRadius:'5px',marginTop:'1.5rem',color:'white',fontSize:'20px',fontStyle:'oblique'}}></input>
        </form>
        </div>
          <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhxzVTBxBnRaIMbQaNX-sT0MzN0mORWdo&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `300px`,borderRadius:`5px`,width:`73%`,marginLeft:`14%`}} />}
          mapElement={<div style={{ height: `100%` }} />}
        /> 
        </div> 
      </div>
    </div>
    );
  }
}

export default App;

