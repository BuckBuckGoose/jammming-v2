import React from "react";

import "./Tracklist.css";

import Track from "../Track/Track";

const TrackList = (props) => {

  return (
    <div className="Tracklist">
      {props.tracks.map((track) => {
        return (
          <Track
            track={track}
            key={track.id}
            onAdd={props.onAdd}
            isRemoval={props.isRemoval}
            onRemove={props.onRemove}
            onPreview={props.onPreview}
          />
        );
      })}
    </div>
  );
};

export default TrackList;
