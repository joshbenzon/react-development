// App.js

import React, { useEffect, useState } from "react";
import "./App.css";
import Song from "./components/Song";
import ItzyImage from "./images/playlists/Itzy Playlist.jpg";
import RoadTripImage from "./images/playlists/Roadtrip Playlist.jpeg";

// ALBUMS
import Checkmate from "./images/albums/Checkmate.png";
import CrazyInLove from "./images/albums/Crazy in Love.jpeg";
import GuessWho from "./images/albums/Guess Who.webp";
import ItzDifferent from "./images/albums/It'z Different.jpeg";
import ItzIcy from "./images/albums/It'z Icy.webp";
import ItzMe from "./images/albums/It'z Me.jpg";
import KillMyDoubt from "./images/albums/Kill My Doubt.jpg";
import NotShy from "./images/albums/Not Shy.jpg";

const albumMap = {
    "It'z Different": ItzDifferent,
    "It'z Icy": ItzIcy,
    "It'z Me": ItzMe,
    "Not Shy": NotShy,
    "Guess Who": GuessWho,
    "Crazy in Love": CrazyInLove,
    "Check Mate": Checkmate,
    "Kill My Doubt": KillMyDoubt,
};

function App() {
    const [songs, setSongs] = useState([]);
    const [addedSongs, setAddedSongs] = useState([]);
    const [originalSongs, setOriginalSongs] = useState([]); // Store the original list of songs

    const [totalDuration, setTotalDuration] = useState("0:00");
    // const [isSortingActive, setIsSortingActive] = useState(false); // New state variable for sorting

    const [isArtistFilterVisible, setIsArtistFilterVisible] = useState(false);
    const [isAlbumFilterVisible, setIsAlbumFilterVisible] = useState(false);
    const [isSortVisible, setIsSortVisible] = useState(false);

    const toggleArtistFilterVisibility = () => {
        setIsArtistFilterVisible(!isArtistFilterVisible);
    };

    const toggleAlbumFilterVisibility = () => {
        setIsAlbumFilterVisible(!isAlbumFilterVisible);
    };

    const toggleSortVisibility = () => {
        setIsSortVisible(!isSortVisible);
    };

    const filterByArtist = (artistName) => {
        const filteredSongs = songs.filter(
            (song) => song.artist === artistName
        );
        setSongs(filteredSongs);
    };

    const filterByAlbum = (albumName) => {
        const filteredSongs = songs.filter((song) => song.album === albumName);
        setSongs(filteredSongs);
    };

    function Dropdown(props) {
        const { isVisible, type, filterFunction } = props; // Added filterFunction prop

        const getOptions = () => {
            switch (type) {
                case "filterArtist":
                    return ["Yeji", "Lia", "Ryujin", "Chaeryeong", "Yuna"];
                case "filterAlbum":
                    return [
                        "It'z Different",
                        "It'z Icy",
                        "It'z Me",
                        "Check Mate",
                        "Kill My Doubt",
                    ];
                default:
                    return [];
            }
        };

        return (
            <div className="dropdown">
                {isVisible && (
                    <ul>
                        {getOptions().map((option, index) => (
                            <li
                                key={index}
                                onClick={() => filterFunction(option)} // Use filterFunction prop
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    const resetFiltersAndSorting = () => {
        setIsArtistFilterVisible(false);
        setIsAlbumFilterVisible(false);
        setIsSortVisible(false);
        setSongs(originalSongs); // Reset songs list to the original state
    };

    useEffect(() => {
        // Fetch data from the CSV file
        fetch("data.csv")
            .then((response) => response.text())
            .then((data) => {
                // Parse CSV data
                const parsedData = parseCSV(data);
                // Set the parsed data in state
                setSongs(parsedData);
                // Save the original list
                setOriginalSongs(parsedData);
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

    const renderSongs = () => {
        return isSortVisible
            ? songs
                  .slice() // Create a copy of the songs array to avoid mutating the original array
                  .sort((a, b) => {
                      // Sort songs by duration (assuming duration is in the format "mm:ss")
                      const [aMinutes, aSeconds] = a.duration
                          .split(":")
                          .map(Number);
                      const [bMinutes, bSeconds] = b.duration
                          .split(":")
                          .map(Number);
                      return (
                          aMinutes * 60 + aSeconds - (bMinutes * 60 + bSeconds)
                      );
                  })
                  .map((song, index) => (
                      <Song
                          key={index}
                          {...song}
                          onToggleAdded={() => handleToggleAdded(index)}
                      />
                  ))
            : songs.map((song, index) => (
                  <Song
                      key={index}
                      {...song}
                      onToggleAdded={() => handleToggleAdded(index)}
                  />
              ));
    };

    return (
        <div className="App">
            <div className="main">
                <div className="favorite">
                    <h2>RoadTrip Playlist</h2>
                    <img
                        id="roadtrip-pic"
                        src={RoadTripImage}
                        alt="RoadTrip Playlist Cover Image"
                    ></img>
                    <p>Time Duration: {totalDuration}m</p>

                    <div className="aggregator">
                        {/* Render Added List of Songs where isAdded is TRUE*/}
                        {addedSongs.map((song, index) => (
                            <div key={index} className="song">
                                <div className="song-info">
                                    <img
                                        className="album-cover"
                                        src={albumMap[song.album]}
                                        alt={`${song.album} Album Cover`}
                                    />

                                    <div className="song-details">
                                        <div className="song-titles">
                                            <h3>{song.title}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="song-info">
                                    <p>{song.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="details">
                        <div className="buttons">
                            <div className="clickable">
                                <div className="filtering">
                                    <button
                                        id="filters-button"
                                        onClick={toggleArtistFilterVisibility}
                                    >
                                        Filter by Artist
                                    </button>
                                    <Dropdown
                                        isVisible={isArtistFilterVisible}
                                        type="filterArtist"
                                        filterFunction={filterByArtist}
                                    />
                                </div>

                                <div className="filtering">
                                    <button
                                        id="filters-button"
                                        onClick={toggleAlbumFilterVisibility}
                                    >
                                        Filter by Album
                                    </button>
                                    <Dropdown
                                        isVisible={isAlbumFilterVisible}
                                        type="filterAlbum"
                                        filterFunction={filterByAlbum}
                                    />
                                </div>

                                <div className="filtering">
                                    <button
                                        id="sorting-button"
                                        onClick={toggleSortVisibility}
                                    >
                                        Sort by Duration
                                    </button>
                                </div>
                            </div>

                            <div className="clickable">
                                <button
                                    id="reset-button"
                                    onClick={resetFiltersAndSorting}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="titles">
                            <h1>Itzy</h1>
                            <img
                                id="itzy-pic"
                                src={ItzyImage}
                                alt="Itzy Playlist Cover Image"
                            ></img>
                        </div>
                    </div>

                    <div className="selection">
                        {/* Render Song components dynamically */}
                        {renderSongs()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
