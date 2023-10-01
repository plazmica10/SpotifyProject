import React,{ useEffect, useState } from 'react';
import './Data.css';

export default function Data() {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]); 
    const [selectedButton, setSelectedButton] = useState('artists');
    const [selectedPeriod, setSelectedPeriod] = useState('6m');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [genres, setGenres] = useState([]);
    
    useEffect(()=>{
        setLoading(true);
        fetch('http://localhost:3000/data')
        .then(response => response.json())
        .then(data => {
            const artistData = data.artists.map(artist => ({
                name: artist.name,
                url: artist.url
            }));
            const trackData = data.tracks.map(track => ({
                name: track.name,
                url: track.url,
                artist: track.artist,
                duration: track.duration,
            }));
            setArtists(artistData);
            setTracks(trackData);
            setGenres(data.genres)
            setLoading(false);
            // console.log(artistData);
        })
        .catch(err => console.log(err))
    },[])

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleButtonClick = (event) => {
        setSelectedButton(event.target.id);
    }

    const handlePeriodClick = (event) => {
        setSelectedPeriod(event.target.id);
        let period = '';

        if(event.target.id === 'lm') {
            period = 'short_term';
        }else if(event.target.id === 'at') {
            period = 'long_term';
        }else{
            period = 'medium_term';
        }
        setLoading(true);
        fetch(`http://localhost:3000/data?period=${period}`)
        .then(response => response.json())
        .then(data => {
            const artistData = data.artists.map(artist => ({
                name: artist.name,
                url: artist.url
            }));
            const trackData = data.tracks.map(track => ({
                name: track.name,
                url: track.url,
                artist: track.artist,
                duration: track.duration,
            }));
            setArtists(artistData);
            setTracks(trackData);
            setGenres(data.genres)
            setLoading(false);
            // console.log(artistData);
        })
        .catch(err => console.log(err))
        
    }
    return (
        <>
            {/* Loading animation */}
            {loading ? (
            <div className='overlay'>
                <div className='loader'></div>
            </div>) : null}
            <div className="button-container">
            <button id="artists" onClick={handleButtonClick} className={selectedButton === 'artists' ? 'focused' : ''}>Top Artists</button>
            <button id="tracks" onClick={handleButtonClick} className={selectedButton === 'tracks' ? 'focused' : ''}>Top Tracks</button>
            <button id="genres" onClick={handleButtonClick} className={selectedButton === 'genres' ? 'focused' : ''}>Top Genres</button>
            </div>
            <div className='button-container'>
            <button id="lm" onClick={handlePeriodClick} className={selectedPeriod === 'lm' ? 'focused' : ''}>Last Month</button>
            <button id="6m" onClick={handlePeriodClick} className={selectedPeriod === '6m' ? 'focused' : ''}>Last 6 Months</button>
            <button id="at" onClick={handlePeriodClick} className={selectedPeriod === 'at' ? 'focused' : ''}>All Time</button>
            </div>
            <br />

            {selectedButton === 'artists' && artists.map((artist, index) => (
                <React.Fragment key={index}>
                    <a href={artist.url} target="_blank">{artist.name}</a>
                    <br />
                </React.Fragment>
            ))}

            {selectedButton === 'tracks' && tracks.map((track, index) => (
                <React.Fragment key={index}>    
                    <a href={track.url} target="_blank">{track.name} </a>
                    <span>- {track.artist}</span>
                    {isMobile ? null : (
                        <>
                            <span> - {track.duration}</span>
                        </>
                    )}
                    <br />
                </React.Fragment>
            ))}
            {selectedButton === 'genres' && genres.map((genre, index) => (
                <React.Fragment key={index}>
                    <span style={{ color: '#646cff'}}>{genre}</span>
                    <br />
                </React.Fragment>
            )
            )}
        </>
    )
}