import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PokemonList from "./PokemonList";
import PokemonDetail from "./PokemonDetail";
import Favorites from "./Favorites";
import Games from "./Games";
import About from "./About";
import MyCollection from "./MyCollection";
import "./App.css";

const API_URL = "http://localhost:5000/api/pokemons";

function App() {
    const [favorites, setFavorites] = useState([]);
    const [collectionPokemons, setCollectionPokemons] = useState([]);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setCollectionPokemons(data);
                    
                    const collectionFavorites = data.filter(pokemon => pokemon.is_favorite);
                    
                    setFavorites(prevFavorites => {
                        const collectionFavoritesFormatted = collectionFavorites.map(pokemon => ({
                            id: `db_${pokemon.id}`,
                            pokemon_id: pokemon.pokemon_id,
                            name: pokemon.name,
                            types: typeof pokemon.types === 'string' ? JSON.parse(pokemon.types) : pokemon.types,
                            image: pokemon.image_url,
                            fromCollection: true,
                            dbId: pokemon.id
                        }));
                        
                        const apiFavorites = prevFavorites.filter(fav => !fav.fromCollection);
                        
                        return [...apiFavorites, ...collectionFavoritesFormatted];
                    });
                }
            } catch (error) {
                console.error("Collection Loading Error:", error);
            }
        };
        
        fetchCollection();
    }, []);

    const toggleFavorite = (pokemon) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.some((fav) => fav.id === pokemon.id)) {
                return prevFavorites.filter((fav) => fav.id !== pokemon.id); 
            } else {
                return [...prevFavorites, pokemon]; 
            }
        });
    };

    const toggleCollectionFavorite = async (dbId, isFavorite) => {
        try {
            const response = await fetch(`${API_URL}/${dbId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ is_favorite: !isFavorite })
            });
            
            if (response.ok) {
                const updatedPokemon = await response.json();
                
                setCollectionPokemons(prevCollection => 
                    prevCollection.map(pokemon => 
                        pokemon.id === dbId ? updatedPokemon : pokemon
                    )
                );
                
                setFavorites(prevFavorites => {
                    const uniqueId = `db_${dbId}`;
                    
                    if (!isFavorite) {
                        const pokemonToAdd = updatedPokemon;
                        return [
                            ...prevFavorites, 
                            {
                                id: uniqueId,
                                pokemon_id: pokemonToAdd.pokemon_id,
                                name: pokemonToAdd.name,
                                types: typeof pokemonToAdd.types === 'string' ? 
                                    JSON.parse(pokemonToAdd.types) : pokemonToAdd.types,
                                image: pokemonToAdd.image_url,
                                fromCollection: true,
                                dbId: pokemonToAdd.id
                            }
                        ];
                    } else {
                        return prevFavorites.filter(fav => fav.id !== uniqueId);
                    }
                });
            }
        } catch (error) {
            console.error("Favorites Status Error:", error);
        }
    };

    return (
        <Router>
            <div>
                {/* Header */}
                <nav className="navbar">
                    <Link to="/" className="logo-link">
                       <img 
                            src="/International_Pokémon_logo.svg.png" 
                            alt="Pokédex" 
                            className="pokemon-logo" 
                        />
                    </Link>
                    <ul className="nav-links">
                    <li><Link to="/">Pokédex</Link></li>
                    <li><Link to="/Favorite">Favorites</Link></li>
                    <li><Link to="/collection">My Collection</Link></li>
                </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<PokemonList toggleFavorite={toggleFavorite} favorites={favorites} />} />
                    <Route path="/pokemon/:id" element={<PokemonDetail />} />
                    <Route path="/Favorite" element={
                        <Favorites 
                            favorites={favorites} 
                            toggleFavorite={toggleFavorite}
                            toggleCollectionFavorite={toggleCollectionFavorite} 
                        />
                    } />
                    <Route path="/collection" element={
                        <MyCollection 
                            favorites={favorites}
                            collectionPokemons={collectionPokemons}
                            setCollectionPokemons={setCollectionPokemons}
                            toggleFavorite={toggleCollectionFavorite}
                        />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;