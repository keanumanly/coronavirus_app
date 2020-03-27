import React, { useEffect, useReducer } from "react";
import "../../../App.css";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  withLeaflet
} from "react-leaflet";
// import { Icon } from "leaflet";
import ReactLeafletSearch from "react-leaflet-search";
import { GetData } from "../../actions/Api";
import { CircleLoading } from "react-loadingg";

function reducer(state, action) {
  switch (action.type) {
    case "viewpoint": {
      return {
        ...state,
        zoom: action.zoom,
        area: action.area
      };
    }
    case "loaded": {
      return {
        ...state,
        cases: action.payloads
      };
    }
    default:
      break;
  }
  return state;
}

const InitialState = {
  zoom: 5,
  area: [14.5995, 120.9842],
  cases: []
};

export default function WorldMap() {
  const ReactLeafletSearchComponent = withLeaflet(ReactLeafletSearch);
  const [state, dispatch] = useReducer(reducer, InitialState);
  const { zoom, area, cases } = state;

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const Loaddata = async () => {
        await GetData()
          .then(res => {
            dispatch({
              type: "loaded",
              name: "general_info",
              payloads: res.data
            });
          })
          .catch(err => console.log(err));
      };
      Loaddata();
      
    }
    return () => {
      console.log("unmounted");
      isSubscribed = false;
    };
  }, []);

  const customPopup = SearchInfo => {
    console.log(SearchInfo.info.split(",")[0]);
    // const result = cases.filter(element => {
    //   if (element.admin2) {
    //     return element.admin2
    //       .toLowerCase()
    //       .match(SearchInfo.info.split(",")[0].toLowerCase());
    //   } else {
    //     return element.combinedKey
    //       .toLowerCase()
    //       .match(SearchInfo.info.split(",")[0].toLowerCase());
    //   }
    // });
  };

  return (
    <React.Fragment>
      {cases.length > 0 ? (
        <Map
          center={area}
          zoom={zoom}
          maxBounds={[
            [-90, -180],
            [90, 180]
          ]}
          maxZoom={7}
          scrollWheelZoom={true}
          // bounds={bounds}
          style={{width:'100%',height:'100vh'}}
          minZoom={4}
          zoomControl={true}
          Name="App"
        >
          {/* <TileLayer
            noWrap={true}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
      contributors'
          /> */}

          <TileLayer
            noWrap={true}
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
            attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
          />
          
          <ReactLeafletSearchComponent
            position="topleft"
            inputPlaceholder="Search Country.. e.g. Philippines"
            showCircle={true}
            zoom={6}
            closeResultsOnClick={true}
            popUp={customPopup}
            // openSearchOnLoad={true}
          />
          {cases.map(element =>
            //global data
            element.confirmed > 0 ? (
              <Marker
                key={element.combinedKey}
                position={[element.lat, element.long]}
                onMouseOver={(e) => {
                  e.target.openPopup();
                }}
                onMouseOut={(e) => {
                  e.target.closePopup();
                }}
                onClick={() => {
                  dispatch({
                    type: "viewpoint",
                    zoom: 6,
                    area: [element.lat, element.long]
                  });
                }}
              >
                <Popup position={[element.lat, element.long]}>
                  <div>
                    <h2
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "16px"
                      }}
                    >
                      {element.provinceState
                        ? element.provinceState + ", " + element.countryRegion
                        : element.combinedKey}
                    </h2>
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#0080FF"
                      }}
                    >
                      Confirmed: <span>{element.confirmed}</span>
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#00A572"
                      }}
                    >
                      Recovered: <span>{element.recovered}</span>
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#D21F3C"
                      }}
                    >
                      Deaths: <span>{element.deaths}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ) : (
              ""
            )
          )}
        </Map>
      ) : (
        <CircleLoading />
      )}
    </React.Fragment>
  );
}

