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
import { Form, Input, Button } from 'antd';
/*
class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }
}
handleChange = address => {
  this.setState({ address });
};

handleChange = address => {
  geocodeByAddress(address)
  .then(results => getLatLng(results[0]))
  .then(latLng => console.log('Success',latLng))
  .catch(error => console.error('Error',error))
};
*/
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
          <div>{this.state.address}</div>
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
    <div class="Whole">
      <div style={{width:'80%',backgroundColor:'white',borderRadius:'5px',alignItems:'center',textAlign:'center'}}>
      <div style={{alignItems:'center',backgroundColor:'white',position:'center',width:'100%'}}>
        <form style={{paddingBottom:'2rem',alignItems:'center',paddingTop:'2rem'}}>
        <input type="text" id="fname" placeholder="Name" style={{width:'25%',marginBottom:'0.5rem',marginRight:'1.5rem',height:'3rem',fontSize:'18px',borderRadius:'5px'}}></input>
        <input type="text" id="lname" placeholder="Family Name" style={{width:'25%',marginBottom:'0.5rem',height:'3rem',fontSize:'18px',borderRadius:'5px'}}></input><br></br>
        <AutoComplete
          style={{width:'53%',marginTop:'1rem',height:'3rem',fontSize:'18px',borderRadius:'5px'}}
          types={['(regions)']}
          onPlaceSelected= {this.onPlaceSelected}
          placeholder="Test Flat, Example Road,London,N42GQ"
          /><br></br>
        <input type="submit" value="Submit" style={{backgroundColor:'#00aeef',width:'6rem',height:'2.5rem',borderRadius:'5px',marginTop:'1.5rem',color:'white',fontSize:'20px',fontStyle:'oblique'}}></input>
      </form>
      </div>
        <MapWithAMarker
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhxzVTBxBnRaIMbQaNX-sT0MzN0mORWdo&v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`,borderRadius:`5px`,padding:'2rem'}} />}
    mapElement={<div style={{ height: `100%` }} />}
  /> 
  </div> 
</div>
    );
  }
}

export default App;

