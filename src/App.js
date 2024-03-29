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
    const [originalSongs, setOriginalSongs] = useState([]);

    const [totalDuration, setTotalDuration] = useState("0:00");

    const [isArtistFilter, setIsArtistFilter] = useState(false);
    const [isAlbumFilter, setIsAlbumFilter] = useState(false);
    const [isSorting, setIsSorting] = useState(false);

    const [artistFilter, setArtistFilter] = useState("");
    const [albumFilter, setAlbumFilter] = useState("");
    // const [filteredSongs, setFilteredSongs] = useState([]);

    const toggleArtistFilterVisibility = () => {
        setIsArtistFilter(!isArtistFilter);
    };

    const toggleAlbumFilterVisibility = () => {
        setIsAlbumFilter(!isAlbumFilter);
    };

    const toggleSortVisibility = () => {
        setIsSorting(!isSorting);
    };

    const filterSongs = () => {
        let songs = originalSongs;

        if (artistFilter !== "") {
            songs = songs.filter((song) => song.artist === artistFilter);
        }

        if (albumFilter !== "") {
            songs = songs.filter((song) => song.album === albumFilter);
        }

        setSongs(songs);
    };

    const filterByArtist = (artistName) => {
        setArtistFilter(artistName);
    };

    const filterByAlbum = (albumName) => {
        setAlbumFilter(albumName);
    };

    useEffect(() => {
        filterSongs();
    }, [artistFilter, albumFilter]);

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
                        "Not Shy",
                        "Guess Who",
                        "Crazy in Love",
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
        setIsArtistFilter(false);
        setIsAlbumFilter(false);
        setIsSorting(false);

        setSongs([...originalSongs]);

        setArtistFilter("");
        setAlbumFilter("");
    };

    useEffect(() => {
        // Fetch data from the CSV file
        fetch("data.csv")
            .then((response) => response.text())
            .then((data) => {
                // Parse CSV data
                const parsedData = parseCSV(data);
                // Save the original list by creating a copy of the parsed data
                setOriginalSongs([...parsedData]);

                setSongs([...parsedData]);
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

    const handleToggleAdded = (index) => {
        const song = songs[index]; // Get the corresponding song from the filtered songs array

        // Find the index of the song in the filtered songs array
        const songIndex = songs.findIndex((s) => s.title === song.title);

        const updatedSongs = [...songs];
        updatedSongs[songIndex].isAdded =
            updatedSongs[songIndex].isAdded === "true" ? "false" : "true";

        // Add or remove the song from addedSongs based on isAdded value
        if (updatedSongs[songIndex].isAdded === "true") {
            setAddedSongs([...addedSongs, updatedSongs[songIndex]]);
        } else {
            const songsAfterRemoval = addedSongs.filter(
                (song) => song.title !== updatedSongs[songIndex].title
            );
            setAddedSongs(songsAfterRemoval);
        }

        // Update the filtered songs state
        setSongs(updatedSongs);
    };

    useEffect(() => {
        // Update filtered songs when sorting visibility changes
        if (isSorting) {
            const sortedSongs = songs.slice().sort((a, b) => {
                const [aMinutes, aSeconds] = a.duration.split(":").map(Number);
                const [bMinutes, bSeconds] = b.duration.split(":").map(Number);
                return aMinutes * 60 + aSeconds - (bMinutes * 60 + bSeconds);
            });
            setSongs(sortedSongs);
        } else {
            filterSongs();
        }
    }, [isSorting]);

    const renderSongs = () => {
        // Check if there are filtered songs, if not, render an empty list
        const songsToRender = songs.length > 0 ? songs : [];

        return songsToRender.map((song, index) => (
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
                        alt="RoadTrip Playlist Cover"
                    ></img>
                    <p id="time-duration">Time Duration: {totalDuration}m</p>

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
                                        isVisible={isArtistFilter}
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
                                        isVisible={isAlbumFilter}
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
                            <h1>itzy</h1>
                            <img
                                id="itzy-pic"
                                src={ItzyImage}
                                alt="Itzy Playlist Cover"
                            ></img>
                        </div>
                    </div>

                    <div className="selection">{renderSongs()}</div>
                </div>
            </div>
        </div>
    );
}

export default App;
