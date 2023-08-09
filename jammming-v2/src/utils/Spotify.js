import axios from "axios";

const clientId = "6ba0055087c94b3cba47645625c0ad41";
const redirectUri = "http://localhost:3000/";
const spotifyApiUrl = "https://api.spotify.com/v1";

let accessToken;

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            console.log('Access token found' + accessToken);
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
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-read-private%20user-read-email%20playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async search(term) {
        if(!term){
            alert("Please enter a search term.");
            return [];
        };
        // Get necessary access token
        const token = this.getAccessToken();
        console.log("Search access token: " + token)
        // Request search for term from Spotify API
        const response = await axios.get(`${spotifyApiUrl}/search?type=track&q=${term}`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // If no tracks are returned, return an empty array
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

    // Save playlist to user's Spotify account
    async savePlaylist(playlistName, trackUris) {
        if(!playlistName || trackUris.length === 0){
            alert("You must enter a playlist name and add songs to the playlist before saving.");
            return;
        }
        if(trackUris.length > 100) {
            alert("You can only add a maximum of 100 songs to a playlist at a time.");
            return;
        }

        this.getAccessToken();
        if(accessToken === undefined){
            alert("You must log in to Spotify before saving a playlist.");
            return;
        }
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        
        // Get user ID
        const userResponse = await axios.get(`${spotifyApiUrl}/me`, { headers: headers })
            .then((response) => {
                userId = response.data.id;
                alert(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error.message);
                return;
            });
        
        
        // Create new playlist and add songs
        let playlistId;
        alert(JSON.stringify(headers));
        await axios.post(`${spotifyApiUrl}/users/${userId}/playlists`, {
            headers: headers,
            body: JSON.stringify({ name: playlistName })
        })
        .then((response) => {
            playlistId = response.data.id;
        })
        .catch((error) => {
            console.log(error.message);
            return;
        });

        await axios.post(`${spotifyApiUrl}/playlists/${playlistId}/tracks`, {
            headers: headers,
            uris: trackUris
        })
        .then((response) => {
            console.log(response);
            if(response.status === 201){
                alert("Playlist successfully saved!");
            };
        })
        .catch((error) => {
            alert(JSON.stringify(error));
            console.log(error.message);
            return;
        });
    }

};

export default Spotify;