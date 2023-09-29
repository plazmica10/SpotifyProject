import React,{ useEffect, useState } from 'react';
import './Data.css';
export default function Data() {
    const [artists, setArtists] = useState([]);
    const [selectedButton, setSelectedButton] = useState('artists');
    const [selectedPeriod, setSelectedPeriod] = useState('6m');

    useEffect(()=>{
        fetch('http://localhost:3000/topartists')
        .then(response => response.json())
        .then(data => {
            const artistData = data.map(artist => ({
                name: artist.name,
                url: artist.url
            }));
            setArtists(artistData);
            // console.log(artistData);
        })
        .catch(err => console.log(err))
    },[])

    const handleButtonClick = (event) => {
        setSelectedButton(event.target.id);
    }

    const handlePeriodClick = (event) => {
        setSelectedPeriod(event.target.id);
    }
    return (
        <>
            <button id="artists" onClick={handleButtonClick} className={selectedButton === 'artists' ? 'focused' : ''}>Top Artists</button>
            <button id="tracks" onClick={handleButtonClick} className={selectedButton === 'tracks' ? 'focused' : ''}>Top Tracks</button>
            <br />
            <button id="lm" onClick={handlePeriodClick} className={selectedPeriod === 'lm' ? 'focused' : ''}>Last Month</button>
            <button id="6m" onClick={handlePeriodClick} className={selectedPeriod === '6m' ? 'focused' : ''}>Last 6 Months</button>
            <button id="at" onClick={handlePeriodClick} className={selectedPeriod === 'at' ? 'focused' : ''}>All Time</button>
            <br />
                {artists.map((artist, index) => (
                    <React.Fragment key={index}>
                        <a href={artist.url} target="_blank">{artist.name}</a>
                        <br />
                    </React.Fragment>
                ))}
        </>
    )
}