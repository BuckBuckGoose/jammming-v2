import React, { useCallback } from "react";
import "./Track.css";

const Track = ({onAdd, onRemove, track, isRemoval, onPreview}) => {
  const addTrack = useCallback(
    (event) => {
      onAdd(track);
    },
    [onAdd, track]
  );

  const removeTrack = useCallback(
    (event) => {
      onRemove(track);
    },
    [onRemove, track]
  );

  const previewTrack = useCallback(
    (event) => {
      onPreview(track);
    },
    [onPreview, track]
  );
    

  const renderButton = () => {
    if (isRemoval) {
      return (
        <button className="Track-action" onClick={removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <button className="Track-action" onClick={addTrack}>
          +
        </button>
      );
    }
  };

  return (
    <div className="Track">
      <div className="Track-info" onClick={previewTrack}>
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      {renderButton()}
    </div>
  );
};

export default Track;
