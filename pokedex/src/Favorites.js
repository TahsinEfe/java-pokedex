import React from "react";
import { Link } from "react-router-dom";
import "./Favorite.css";

function Favorites({ favorites, toggleFavorite, toggleCollectionFavorite }) {
    // Favorileriniz boşsa gösterilecek mesaj
    if (favorites.length === 0) {
        return (
            <div className="favorite-empty">
                <h2>Your favorites list is empty.</h2>
                <p>Add some Pokemon to your favorites list!</p>
                <Link to="/" className="back-button">Return to Pokedex</Link>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h1>Your Favorite Pokemon</h1>
            <div className="pokemon-grid">
                {favorites.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-card">
                        <span
                            className="favorite-star favorited"
                            onClick={() => {
                                if (pokemon.fromCollection) {
                                    toggleCollectionFavorite(pokemon.dbId, true);
                                } else {
                                    toggleFavorite(pokemon);
                                }
                            }}
                        >
                            ⭐
                        </span>
                        <Link to={`/pokemon/${pokemon.pokemon_id || pokemon.id}`}>
                            <img 
                                src={pokemon.image || pokemon.sprites?.front_default} 
                                alt={pokemon.name} 
                            />
                            <h3>{pokemon.name.toUpperCase()}</h3>
                            <div className="pokemon-types">
                                {pokemon.types.map((typeInfo) => {
                                    // İki farklı API formatını desteklemek için
                                    const typeName = typeof typeInfo === 'object' ? typeInfo.type.name : typeInfo;
                                    return (
                                        <span key={typeName} className={`type ${typeName}`}>
                                            {typeName}
                                        </span>
                                    );
                                })}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;