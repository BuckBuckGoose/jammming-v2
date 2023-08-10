import React from "react";
import "./Playlist.css";
import Tracklist from "../Tracklist/Tracklist";

const Playlist = (props) => {
  const handleNameChange = (event) => {
    props.onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <input onChange={handleNameChange} defaultValue={"New Playlist"} />
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
      <Tracklist
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true}
        onPreview={props.onPreview}
      />
    </div>
  );
};

export default Playlist;
