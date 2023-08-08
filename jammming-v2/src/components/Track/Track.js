import React from "react";


const Track = (props) => {
  return <div className="Track">
    <h3>{props.track.title}</h3>
    <p>{props.track.artist} | {props.track.album}</p>
  </div>;
};
