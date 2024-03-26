import React from "react";
import "./Song.css";

import ItzDifferent from "../../images/albums/It'z Different.jpeg";
import AddIcon from "../../images/icons/Plus.png";

const Song = () => {
    return (
        <div className="song">
            <div className="song-info">
                <img
                    className="album-cover"
                    src={ItzDifferent}
                    alt="It'z Different Album Cover"
                ></img>

                <div className="song-details">
                    <div className="song-titles">
                        <h3>Dalla Dalla ・</h3>
                        <h4>It'z Different</h4>
                    </div>

                    <h5>Yeji</h5>
                </div>
            </div>

            <div className="song-info">
                <p>1:23</p>
                <img className="icon" src={AddIcon} alt="Add Icon"></img>
            </div>
        </div>
    );
};

export default Song;
