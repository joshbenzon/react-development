import "./App.css";

import ItzyImage from "./images/playlists/Itzy Playlist.jpg";
import RoadTripImage from "./images/playlists/Roadtrip Playlist.jpeg";

import Song from "./components/song/Song";

function App() {
    return (
        <div className="App">
            <div className="main">
                <div className="favorite">
                    <h2>RoadTrip Playlist</h2>
                    <img
                        className="roadtrip-pic"
                        src={RoadTripImage}
                        alt="RoadTrip Playlist Cover Image"
                    ></img>
                    <p>[TODO] Time Duration</p>

                    <div>[TODO] Added List of Songs</div>
                </div>

                <div>
                    <div className="details">
                        <div className="buttons">
                            <button className="reset-button">Reset</button>

                            <div>
                                <button className="filters-button">
                                    Filters
                                </button>
                                <button className="sorting-button">
                                    Sorting
                                </button>
                            </div>
                        </div>

                        <div className="titles">
                            <h1>Itzy</h1>
                            <img
                                className="itzy-pic"
                                src={ItzyImage}
                                alt="Itzy Playlist Cover Image"
                            ></img>
                        </div>
                    </div>

                    <div className="selection">
                        <Song></Song>
                        <Song></Song>
                        <Song></Song>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
