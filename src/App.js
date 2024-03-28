// App.js

import React, { useEffect, useState } from "react";
import "./App.css";
import Song from "./components/song/Song";
import ItzyImage from "./images/playlists/Itzy Playlist.jpg";
import RoadTripImage from "./images/playlists/Roadtrip Playlist.jpeg";

function App() {
    const [songs, setSongs] = useState([]);
    const [addedSongs, setAddedSongs] = useState([]);
    const [totalDuration, setTotalDuration] = useState("0:00");

    useEffect(() => {
        // Fetch data from the CSV file
        fetch("data.csv")
            .then((response) => response.text())
            .then((data) => {
                // Parse CSV data
                const parsedData = parseCSV(data);
                // Set the parsed data in state
                setSongs(parsedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        // Calculate total duration when songs change
        const calculateTotalDuration = () => {
            let totalSeconds = 0;

            addedSongs.forEach((song) => {
                const [minutes, seconds] = song.duration.split(":");
                totalSeconds += parseInt(minutes) * 60 + parseInt(seconds);
            });

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            setTotalDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        };

        calculateTotalDuration();
    }, [addedSongs]);

    const handleToggleAdded = (index) => {
        const updatedSongs = [...songs];

        updatedSongs[index].isAdded =
            updatedSongs[index].isAdded === "true" ? "false" : "true";
        setSongs(updatedSongs);

        // Add or remove the song from addedSongs based on isAdded value
        if (updatedSongs[index].isAdded === "true") {
            // setAddedSongs([...addedSongs, updatedSongs[index]]); // Append the song to addedSongs
            setAddedSongs([...addedSongs, updatedSongs[index]]); // Append the song to addedSongs
        } else {
            const filteredSongs = addedSongs.filter(
                (song) => song.title !== updatedSongs[index].title
            );
            setAddedSongs(filteredSongs); // Remove the song from addedSongs
        }
    };

    const parseCSV = (csvData) => {
        const rows = csvData.split("\n");
        const headers = rows[0].split(",");
        const parsedData = [];

        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(",");
            const song = {};

            headers.forEach((header, index) => {
                song[header] = rowData[index];
            });

            parsedData.push(song);
        }

        return parsedData;
    };

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
                    <p>Time Duration: {totalDuration}m</p>

                    <div>
                        {/* Render Added List of Songs where isAdded is TRUE*/}
                        {songs
                            .filter((song) => song.isAdded === "true")
                            .map((song, index) => (
                                <div key={index}>{song.title}</div>
                            ))}
                    </div>
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
                        {/* Render Song components dynamically */}
                        {songs.map((song, index) => (
                            <Song
                                key={index}
                                {...song}
                                onToggleAdded={() => handleToggleAdded(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
