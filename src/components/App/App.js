import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import SongPreview from "../SongPreview/SongPreview";
import Spotify from "../../utils/Spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [songPreview, setSongPreview] = useState({});
  const [songPreviewVisible, setSongPreviewVisible] = useState(false);

  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  const handleUpdatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => {
        return [...prevTracks, track];
      });
    },
    [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevPlaylistTracks) => {
      return prevPlaylistTracks.filter(
        (savedTrack) => savedTrack.id !== track.id
      );
    });
  }, []);

  const search = useCallback((term) => {
    Spotify.search(term)
      .then((searchResultTracks) => {
        console.log(
          "App.js Search Results" + JSON.stringify(searchResultTracks)
        );
        setSearchResults(searchResultTracks);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris);
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
  }, [playlistName, playlistTracks]);

  const hidePreviewWindow = useCallback(() => {
    setSongPreviewVisible(false);
    setSongPreview({});
    Spotify.pause().catch((err) => {
      console.log(err.message);
    });
  }, []);

  const showPreviewWindow = useCallback(
    (track) => {
      setSongPreviewVisible(true);
      console.log("Show Preview Window" + songPreviewVisible);
      setSongPreview(track);
      Spotify.play(track.uri);
    },
    [songPreviewVisible]
  );

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults
            searchResults={searchResults}
            onAdd={addTrack}
            onPreview={showPreviewWindow}
          />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={handleUpdatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
            onPreview={showPreviewWindow}
          />
        </div>
        {songPreviewVisible ? (
          <SongPreview
            onClose={hidePreviewWindow}
            song={songPreview}
            visible={songPreviewVisible}
          />
        ) : null}
      </div>
      <footer>
        Made by Kyle Buck |{" "}
        <a href="https://github.com/BuckBuckGoose/jammming-v2">Github</a>
      </footer>
    </div>
  );
}

export default App;
