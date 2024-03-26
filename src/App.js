import "./App.css";

import RoadTripImage from "./images/playlists/Roadtrip Platylist.jpeg";

function App() {
    return (
        <div className="App">
            <div className="main">
                <div className="favorite">
                    <h2>RoadTrip Playlist</h2>
                    <img
                        src={RoadTripImage}
                        alt="RoadTrip Playlist Cover Image"
                    ></img>
                    <p>[TODO] Time Duration</p>

                    <div>[TODO] Added List of Songs</div>
                </div>

                <div>
                    <div className="details">
                        <h1>Itzy</h1>
                    </div>

                    <div className="selection">selection</div>
                </div>
            </div>
        </div>
    );
}

export default App;
