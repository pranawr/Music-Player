import React, { useState, useEffect } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CardGroupHeading from './../CardGroupHeading/CardGroupHeading';
import CardGroup from "./../Card/CardGroup";
import CheckCardgrp from "../myBootstrap/CheckCardgrp";
import { Credentials } from './../../Credentials';
import axios from "axios";

function TopChart(props) {

    const spotify = Credentials();

    console.log('RENDERING APP.JS');

    const [token, setToken] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetPlaylist = async (currToken, playlistId) => {


        await axios(`https://api.spotify.com/v1/playlists/${playlistId}/tracks `, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken
            }
        })
            .then(tracksResponse => {
                let tempArray = [];
                for (let i = 0; i < tracksResponse.data.items.length; i++) {
                    tempArray = [...tempArray, {
                        index: tempArray.length,
                        artists: tracksResponse.data.items[i].track.artists[0].name,
                        spotifyLink: tracksResponse.data.items[i].track.external_urls.spotify,
                        trackId: tracksResponse.data.items[i].track.id,
                        imageUrl: tracksResponse.data.items[i].track.album.images[1].url,
                        trackName: tracksResponse.data.items[i].track.name,
                        trackPreviewUrl: tracksResponse.data.items[i].track.preview_url
                    }]
                }
                setTracks(tempArray);
            });
        setLoading(true);
        // tracksResponse.data.items.length
    }

    const buttonClicked = async (currToken) => {

        await axios(`https://api.spotify.com/v1/search?q=Global%20Top%2050&type=playlist`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken
            }
        })
            .then(tracksResponse => {
                GetPlaylist(currToken, tracksResponse.data.playlists.items[0].id)
            })


    }

    useEffect(() => {

        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                // console.log(tokenResponse)
                let curr = tokenResponse.data.access_token
                setToken(curr);
                buttonClicked(curr);
            });


    }, [spotify.ClientId, spotify.ClientSecret]);

    return (
        <div>
            <CardGroupHeading
                name="Top Charts"
            />
            {loading?<CardGroup playlist={tracks}/>:<h1>WAITING</h1>}
            {/* <CardGroup playlist={tracks}/> */}
            {/* {loading ? <CheckCardgrp playlist={tracks} /> : <h1>WAITING</h1>} */}

        </div>

    );
}

export default TopChart;