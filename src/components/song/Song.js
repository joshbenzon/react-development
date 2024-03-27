import React from "react";
import "./Song.css";

import MinusIcon from "../../images/icons/Minus.png";
import AddIcon from "../../images/icons/Plus.png";

import ItzDifferent from "../../images/albums/It'z Different.jpeg";

const albumMap = {
    "It'z Different": ItzDifferent,
};

const Song = ({ cover, title, album, artist, duration, isAdded }) => {
    console.log(cover);

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
                {isAdded ? (
                    <img className="icon" src={AddIcon} alt="Add Icon" />
                ) : (
                    <img className="icon" src={MinusIcon} alt="Minus Icon" />
                )}
            </div>
        </div>
    );
};

export default Song;
