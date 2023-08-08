import axios from "axios";

const clientId = "6ba0055087c94b3cba47645625c0ad41";
const redirectUri = "http://localhost:3000/";
const spotifyApiUrl = "https://api.spotify.com/v1";

let accessToken;

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // Check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        // Check for expiration time match
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenMatch && expiresInMatch){
            // Set access token value
            accessToken = accessTokenMatch[1];
            // Set expiration time
            const expiresIn = Number(expiresInMatch[1]);
            // Set access token to expire at the value for expiration time
            window.setTimeout(() => accessToken = "", expiresIn * 1000);
            // Clear the parameters from the URL, so the app doesn't try grabbing the access token after it has expired
            window.history.pushState("Access Token", null, "/");
        } else {
            // Redirect user to Spotify authorization page
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async search(term) {
        // Get necessary access token
        Spotify.getAccessToken();
        // Request search for term from Spotify API
        const response = await axios.get(`${spotifyApiUrl}/search?type=track&q=${term}`, 
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log('Spotify.js items: ' + JSON.stringify(response.data.tracks.items));
        if(!response.data.tracks.items){
            return [];
        }
            const responseArray = response.data.tracks.items.map((track) => {
                const newTrack = {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                };
                return newTrack;
            });
            return responseArray;
        },

    async savePlaylist(playlistName, trackUris) {
        if(!playlistName || trackUris.length === 0){
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        // Get user ID
        await axios.get(`${spotifyApiUrl}/me`, { headers: headers })
            .then((response) => {
                userId = response.data.id;
            })
            .catch((error) => {
                console.log(error.message);
            });
        
    }

};

export default Spotify;