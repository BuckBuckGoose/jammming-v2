import React from "react";
import "./SongPreview.css";

const SongPreview = (props) => {
  

    const closePreview = () => {
        props.onClose();
    }

    const showPreview = () => {
        props.onShow();
    }



        return (
            <div className="SongPreview">
                <button className="close-window" onClick={closePreview}>
                    X
                </button>
                <div className="song-info">
                    <img src={props.song.albumArt} alt="Album Art" />
                    <h5>Now Previewing:</h5>
                    <h2>{props.song.name}</h2>
                    <p className="artist">{props.song.artist}</p>
                    <p className="album">{props.song.album}</p>
                </div>
            </div>
        );
    };

export default SongPreview;