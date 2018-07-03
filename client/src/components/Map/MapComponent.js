import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
// import { MapSidebar } from "./MapSidebar";
// import MapSidebarItem from "./MapSidebarItem";
// import MapSidebarItem from "MapSidebar/MapSidebarItem";

const boxShadow = "box-shadow";

const style = {
  height: "70vh",
  width: "70vw",
  overflow: "auto",
  margin: "2vh 0px 0px 26vw",
  boxShadow: "-3px 5px 3px #dddddd",
};

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    centerLat: "",
    centerLng: "",
    currentLocation: {},
    trucks: [
      {
        name: "Temple Coffee",
        id: 1,
        type: "Coffee",
        description: "Great coffee, questionable pastries.",
        position: {
          lat: 38.5639,
          lng: -121.4724,
        },
      },
      {
        name: "Miyagi Bar & Sushi",
        id: 2,
        type: "Japanese",
        description: "mediocre japanese food!",
        position: {
          lat: 38.5734,
          lng: -121.4022,
        },
      },
    ],
  };

  componentDidMount() {
    this.sessionStorageRedefine();
    if (this.state.centerLat === "" && this.state.centerLng === "") {
      this.getCurrentLocation();
    }
  }

  // loadVenues = () => {
  //   API.allTrucks()
  //     .then(res =>
  //       this.setState({
  //         trucks: res.data,
  //         name: "",
  //         id: "",
  //         type: "",
  //         description: "",
  //         postion: {},
  //       })
  //     )
  //     .catch(err => console.log(err));
  // };

  sessionStorageRedefine = () => {
    var originalSetItem = sessionStorage.setItem;

    sessionStorage.setItem = function() {
      var event = new Event("itemInserted");
      originalSetItem.apply(this, arguments);
      document.dispatchEvent(event);
    };

    var storageHandler = function(e) {
      console.log("sessionStorage changed!");
    };

    document.addEventListener("itemInserted", storageHandler, false);
  };

  componentDidUpdate() {
    // this.centerMoved(mapProps, map);
    console.log("component updated!!");
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      centerLat: props.position.lat,
      centerLng: props.position.lng,
    });

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });

  mapBoundsChangeListener = (mapProps, map) => {
    const { google } = mapProps;
    google.maps.event.addListener(map, "idle", () => {
      console.log("idling");
      var bounds = map.getBounds();
      console.log(bounds);
      this.updateBounds(bounds);
      //   console.log(this.currentMapBouds);
      //   let someTrucks = this.state.trucks;
      //   this.trucksToList(someTrucks, this.currentMapBouds);
    });
  };

  updateBounds = newBounds => {
    let hambreCMB = {
      northBound: newBounds.f.f,
      southBound: newBounds.f.b,
      westBound: newBounds.b.f,
      eastBound: newBounds.b.b,
    };
    sessionStorage.setItem("hambreCMB", JSON.stringify(hambreCMB));
    console.log(JSON.parse(sessionStorage.hambreCMB));
  };

  //Centers the map on user's current location
  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      var currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log(currentPosition);
      this.setState({
        centerLat: position.coords.latitude,
        centerLng: position.coords.longitude,
        currentLocation: currentPosition,
      });
      console.log(this.state.currentLocation);
    });
  };

  //for testing purposes
  logThatShit = item => {
    console.log(item);
  };
  render() {
    // let listItemsToRender = this.trucksToList(this.state.trucks, this.bounds);
    return (
      <Map
        className="border"
        google={this.props.google}
        style={style}
        center={{
          lat: this.state.centerLat,
          lng: this.state.centerLng,
        }}
        zoom={14}
        onReady={this.mapBoundsChangeListener}
        onClick={this.onMapClicked}
      >
        <Marker
          onClick={this.onMarkerClick}
          name="User"
          type=" "
          description="Current user location"
          position={this.state.currentLocation}
        />
        {this.state.trucks.map(truck => {
          return (
            <Marker
              onClick={this.onMarkerClick}
              key={truck.id}
              id={truck.id}
              name={truck.name}
              type={truck.type}
              description={truck.description}
              position={truck.position}
              //added custom icon for food trucks
              icon={{
                url: "../../../truck-catering.png",
                anchor: new this.props.google.maps.Point(32, 32),
                scaledSize: new this.props.google.maps.Size(40, 40),
              }}
            />
          );
        })}
        <InfoWindow
          onClose={this.onInfoWindowClose}
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
            <h2>{this.state.selectedPlace.type}</h2>
            <p>{this.state.selectedPlace.description}</p>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAiP0Yq6i8AvrDFTcEpCI-FbQQGc8M02vo",
})(MapContainer);
