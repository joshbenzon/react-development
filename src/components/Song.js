import React from "react";

// ICONS
import MinusIcon from "../images/icons/Minus.png";
import AddIcon from "../images/icons/Plus.png";

// ALBUMS
import Checkmate from "../images/albums/Checkmate.png";
import CrazyInLove from "../images/albums/Crazy in Love.jpeg";
import GuessWho from "../images/albums/Guess Who.webp";
import ItzDifferent from "../images/albums/It'z Different.jpeg";
import ItzIcy from "../images/albums/It'z Icy.webp";
import ItzMe from "../images/albums/It'z Me.jpg";
import KillMyDoubt from "../images/albums/Kill My Doubt.jpg";
import NotShy from "../images/albums/Not Shy.jpg";

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

// SONG COMPONENT
const Song = ({ title, album, artist, duration, isAdded, onToggleAdded }) => {
    return (
        <div className="song">
            <div className="song-info">
                <img
                    className="album-cover"
                    src={albumMap[album]}
                    alt={`${album} Album Cover`}
                />

                <div className="song-details">
                    <div className="song-titles">
                        <h3>{title} ・</h3>
                        <h4>{album}</h4>
                    </div>

                    <h5>{artist}</h5>
                </div>
            </div>

            <div className="song-info">
                <p>{duration}</p>
                {isAdded === "true" ? (
                    <img
                        className="icon"
                        src={MinusIcon}
                        alt="Minus Icon"
                        onClick={onToggleAdded}
                    />
                ) : (
                    <img
                        className="icon"
                        src={AddIcon}
                        alt="Add Icon"
                        onClick={onToggleAdded}
                    />
                )}
            </div>
        </div>
    );
};

export default Song;
