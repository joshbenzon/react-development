import React, { useEffect, useState } from "react";
import "./App.css";

import Song from "./components/Song";

// IMAGES
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

// APP COMPONENT
function App() {
    // USE STATES
    const [songs, setSongs] = useState([]);
    const [addedSongs, setAddedSongs] = useState([]);
    const [originalSongs, setOriginalSongs] = useState([]);
    const [totalDuration, setTotalDuration] = useState("0:00");
    const [isArtistFilter, setIsArtistFilter] = useState(false);
    const [artistFilter, setArtistFilter] = useState("");
    const [isAlbumFilter, setIsAlbumFilter] = useState(false);
    const [albumFilter, setAlbumFilter] = useState("");
    const [isSorting, setIsSorting] = useState(false);

    // TOGGLE FUNCTIONS
    const toggleArtistFilter = () => {
        setIsArtistFilter(!isArtistFilter);
    };

    const toggleAlbumFilter = () => {
        setIsAlbumFilter(!isAlbumFilter);
    };

    const toggleSorting = () => {
        setIsSorting(!isSorting);
    };

    // FILTER FUNCTIONS
    const filterByArtist = (artist) => {
        setArtistFilter(artist);
    };

    const filterByAlbum = (album) => {
        setAlbumFilter(album);
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

    // RESET FUNCTIONS
    const resetFiltersAndSorting = () => {
        setSongs([...originalSongs]);
        setIsArtistFilter(false);
        setArtistFilter("");
        setIsAlbumFilter(false);
        setAlbumFilter("");
        setIsSorting(false);
    };

    // OTHER FUNCTIONS
    const parseData = (csvData) => {
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
        const originalSong = songs[index]; // corresponding song from the ORIGINAL songs

        // index of the song in the FILTERED songs
        const filteredSongIndex = songs.findIndex(
            (s) => s.title === originalSong.title
        );

        const updatedSongs = [...songs];

        updatedSongs[filteredSongIndex].isAdded =
            updatedSongs[filteredSongIndex].isAdded === "true"
                ? "false"
                : "true";

        // add/remove the song from addedSongs based on the isAdded boolean
        if (updatedSongs[filteredSongIndex].isAdded === "true") {
            setAddedSongs([...addedSongs, updatedSongs[filteredSongIndex]]);
        } else {
            const songsAfterRemoval = addedSongs.filter(
                (song) => song.title !== updatedSongs[filteredSongIndex].title
            );
            setAddedSongs(songsAfterRemoval);
        }

        setSongs(updatedSongs);
    };

    const renderSongs = () => {
        const songsToRender = songs.length > 0 ? songs : []; // check if there are any songs

        return songsToRender.map((song, index) => (
            <Song
                key={index}
                {...song}
                onToggleAdded={() => handleToggleAdded(index)}
            />
        ));
    };

    // DROPDOWN
    const Dropdown = (props) => {
        const { isVisible, filterType, filterFunction } = props;

        const getFilterOptions = () => {
            switch (filterType) {
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
                        {getFilterOptions().map((option, index) => (
                            <li
                                key={index}
                                onClick={() => filterFunction(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    // USE EFFECTS
    useEffect(() => {
        fetch("data.csv") // load data
            .then((response) => response.text())
            .then((data) => {
                const parsedData = parseData(data);
                setOriginalSongs([...parsedData]); // save the original song list
                setSongs([...parsedData]);
            })
            .catch((error) => console.error("Error Fetching Data:", error));
    }, []); // update when first rendering page

    useEffect(() => {
        const calculateTotalDuration = () => {
            let totalSeconds = 0;

            // update to correct format ("minutes:seconds")
            addedSongs.forEach((song) => {
                const [minutes, seconds] = song.duration.split(":");
                totalSeconds += parseInt(minutes) * 60 + parseInt(seconds);
            });

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            setTotalDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        };

        calculateTotalDuration();
    }, [addedSongs]); // update whenever new songs added

    useEffect(() => {
        filterSongs();
    }, [artistFilter, albumFilter]); // update whenever a new filter is used

    useEffect(() => {
        if (isSorting) {
            // update to correct format ("minutes:seconds")
            const sortedSongs = songs.slice().sort((a, b) => {
                const [aMinutes, aSeconds] = a.duration.split(":").map(Number);
                const [bMinutes, bSeconds] = b.duration.split(":").map(Number);
                return aMinutes * 60 + aSeconds - (bMinutes * 60 + bSeconds);
            });
            setSongs(sortedSongs);
        } else {
            filterSongs();
        }
    }, [isSorting]); // update whenever sorting is updated

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
                                        onClick={toggleArtistFilter}
                                    >
                                        Filter by Artist
                                    </button>
                                    <Dropdown
                                        isVisible={isArtistFilter}
                                        filterType="filterArtist"
                                        filterFunction={filterByArtist}
                                    />
                                </div>

                                <div className="filtering">
                                    <button
                                        id="filters-button"
                                        onClick={toggleAlbumFilter}
                                    >
                                        Filter by Album
                                    </button>
                                    <Dropdown
                                        isVisible={isAlbumFilter}
                                        filterType="filterAlbum"
                                        filterFunction={filterByAlbum}
                                    />
                                </div>

                                <div className="filtering">
                                    <button
                                        id="sorting-button"
                                        onClick={toggleSorting}
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
