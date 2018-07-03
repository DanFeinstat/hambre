import React, { Component } from "react";
import MapSidebarItem from "./MapSidebarItem";
import QueueAnim from "rc-queue-anim";
import ReactCardFlipper from "react-card-flipper";
import MSItemDesc from "./MSItemDesc";

const styles = {
  div: {
    // position: "relative",
    // left: "70vw",
    width: "26vw",
  },
};

class MapSidebar extends Component {
  state = {
    toDisplay: [],
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
    this.sessionStorageListener(this.state.trucks);
  }

  sessionStorageListener = trucks => {
    var storageHandler = e => {
      let newMapBounds = JSON.parse(sessionStorage.getItem("hambreCMB"));
      console.log(newMapBounds);
      var toDisplay = [];
      for (var i = 0; i < trucks.length; i++) {
        if (
          trucks[i].position.lat < newMapBounds.northBound &&
          trucks[i].position.lat > newMapBounds.southBound &&
          trucks[i].position.lng < newMapBounds.westBound &&
          trucks[i].position.lng > newMapBounds.eastBound
        ) {
          toDisplay.push(trucks[i]);
        }
      }
      this.setState({
        toDisplay: toDisplay,
      });
      // console.log("sessionStorage changed!");
    };

    document.addEventListener("itemInserted", storageHandler, false);
  };

  render() {
    return (
      <ul style={styles.div} className="list-group">
        <QueueAnim>
          {this.state.toDisplay
            ? this.state.toDisplay.map((truck, props) => {
                return (
                  <MapSidebarItem
                    key={truck.id}
                    id={truck.id}
                    name={truck.name}
                    type={truck.type}
                    description={truck.description}
                  />
                );
              })
            : this.state.trucks.map(truck => {
                return <p>No items currently</p>;
              })}
        </QueueAnim>
      </ul>
    );
  }
}

export default MapSidebar;
