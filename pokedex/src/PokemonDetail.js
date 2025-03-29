import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PokemonDetail.css";
import vulpixSound from './pokemon_37_cry.mp3'; 


const typeColors = {
    grass: "#78C850",
    poison: "#A040A0",
    fire: "#F08030",
    water: "#6890F0",
    bug: "#A8B820",
    normal: "#A8A878",
    electric: "#F8D030",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ghost: "#705898",
    ice: "#98D8D8",
    dragon: "#7038F8",
    steel: "#B8B8D0",
    flying: "#A890F0",
    dark: "#705848"
};

function PokemonDetail() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [activeTab, setActiveTab] = useState("about");
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef(null);
    
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data);
                
                fetch(data.species.url)
                    .then((response) => response.json())
                    .then((speciesData) => setSpecies(speciesData));
            });
    }, [id]);
    
    const playCrySound = () => {
        if (audioRef.current) {
            setAudioError(false);
            
            audioRef.current.currentTime = 0;
            
            audioRef.current.play().catch(error => {
                console.log("Sound Error:", error);
                setAudioError(true);
            });
        } else {
            console.log("Audio reference not available");
            setAudioError(true);
        }
    };
    
    const getStatPercentage = (value) => {
        return Math.min(100, (value / 255) * 100);
    };
    
    if (!pokemon) return <div className="loading-spinner">Loading...</div>;
    
    const prevId = parseInt(id) > 1 ? parseInt(id) - 1 : null;
    const nextId = parseInt(id) < 1025 ? parseInt(id) + 1 : null;
    
    const getDescription = () => {
        if (!species) return "Loading...";
        
        const flavorText = species.flavor_text_entries.find(
            entry => entry.language.name === "en"
        );
        
        return flavorText ? flavorText.flavor_text.replace(/\f/g, " ") : "No Info.";
    };
    
    const getAudioSource = () => {
        if (id === "37") {
            return vulpixSound;
        } else {
            return `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`;
        }
    };
    
    return (
        <div className="pokemon-detail-container">
            <div className="pokemon-detail-nav">
                {prevId && <Link to={`/pokemon/${prevId}`} className="nav-button">← Previous</Link>}
                <Link to="/" className="nav-button home-button">Main Page</Link>
                {nextId && <Link to={`/pokemon/${nextId}`} className="nav-button">Next →</Link>}
            </div>
            
            <div className="pokemon-detail-card">
                <div className="pokemon-header" style={{
                    background: pokemon.types.length > 1 
                        ? `linear-gradient(90deg, ${typeColors[pokemon.types[0].type.name]} 0%, ${typeColors[pokemon.types[1].type.name]} 100%)`
                        : typeColors[pokemon.types[0].type.name]
                }}>
                    <h1>{pokemon.name.toUpperCase()} #{pokemon.id.toString().padStart(3, '0')}</h1>
                    
                    <div className="pokemon-type-badges">
                        {pokemon.types.map((typeInfo) => (
                            <span 
                                key={typeInfo.type.name} 
                                className="type-badge"
                                style={{ backgroundColor: typeColors[typeInfo.type.name] }}
                            >
                                {typeInfo.type.name.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="pokemon-image-container">
                    <img 
                        src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default} 
                        alt={pokemon.name}
                        className="pokemon-image"
                    />
                    <button onClick={playCrySound} className="play-button">
                        🔊 Cry Sound {id === "37" ? "(Vulpix Special)" : ""}
                    </button>
                    {audioError && (
                        <p className="audio-error">
                            Sound could not be played. Please check your browser settings.
                        </p>
                    )}
                </div>
                
                <div className="pokemon-info-tabs">
                    <div className="tab-buttons">
                        <button 
                            className={activeTab === "about" ? "active" : ""} 
                            onClick={() => setActiveTab("about")}
                        >
                            About
                        </button>
                        <button 
                            className={activeTab === "stats" ? "active" : ""} 
                            onClick={() => setActiveTab("stats")}
                        >
                            Stats
                        </button>
                        <button 
                            className={activeTab === "moves" ? "active" : ""} 
                            onClick={() => setActiveTab("moves")}
                        >
                            Moves
                        </button>
                    </div>
                    
                    <div className="tab-content">
                        {activeTab === "about" && (
                            <div className="about-tab">
                                <p className="pokemon-description">{getDescription()}</p>
                                
                                <div className="pokemon-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Height:</span>
                                        <span className="detail-value">{pokemon.height / 10} m</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Weight:</span>
                                        <span className="detail-value">{pokemon.weight / 10} kg</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Abilities:</span>
                                        <span className="detail-value">
                                            {pokemon.abilities.map(ability => 
                                                ability.ability.name.replace('-', ' ')
                                            ).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "stats" && (
                            <div className="stats-tab">
                                {pokemon.stats.map(stat => (
                                    <div className="stat-item" key={stat.stat.name}>
                                        <span className="stat-name">
                                            {stat.stat.name === "hp" ? "HP" : 
                                             stat.stat.name === "attack" ? "Attack" : 
                                             stat.stat.name === "defense" ? "Defense" : 
                                             stat.stat.name === "special-attack" ? "Special Attack" : 
                                             stat.stat.name === "special-defense" ? "Special Defense" : 
                                             "Speed"}:
                                        </span>
                                        <span className="stat-value">{stat.base_stat}</span>
                                        <div className="stat-bar-bg">
                                            <div 
                                                className="stat-bar-fill" 
                                                style={{ 
                                                    width: `${getStatPercentage(stat.base_stat)}%`,
                                                    backgroundColor: getStatPercentage(stat.base_stat) > 50 ? "#4CAF50" : "#FFC107"
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {activeTab === "moves" && (
                            <div className="moves-tab">
                                <div className="moves-list">
                                    {pokemon.moves.slice(0, 20).map(move => (
                                        <div className="move-item" key={move.move.name}>
                                            {move.move.name.replace('-', ' ')}
                                        </div>
                                    ))}
                                </div>
                                {pokemon.moves.length > 20 && (
                                    <p className="more-moves">+{pokemon.moves.length - 20} More Moves...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <audio 
                    ref={audioRef} 
                    src={getAudioSource()}
                    preload="auto"
                />
            </div>
        </div>
    );
}

export default PokemonDetail;