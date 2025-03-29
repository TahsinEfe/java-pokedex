import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MyCollection.css";

const API_URL = "http://localhost:5000/api/pokemons";
const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon";

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

const statColors = {
    hp: "#ff5959",
    attack: "#f5ac78",
    defense: "#fae078",
    speed: "#fa92b2"
};

const ITEMS_PER_PAGE = 20;

function MyCollection({ collectionPokemons, setCollectionPokemons, toggleFavorite }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPokemons, setSelectedPokemons] = useState([]);
    const [collectionSelectedPokemons, setCollectionSelectedPokemons] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        if (isFormOpen && pokemonList.length === 0) {
            fetchPokemonList();
        }
    }, [isFormOpen]);

    useEffect(() => {
        if (pokemonList.length > 0) {
            const filtered = searchQuery 
                ? pokemonList.filter(pokemon => 
                    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pokemon.id.toString().includes(searchQuery)
                )
                : pokemonList;
            
            setFilteredList(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
            setCurrentPage(1);
        }
    }, [searchQuery, pokemonList]);

    const fetchPokemonList = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await fetch(`${POKEAPI_URL}?limit=1000`);
            if (!response.ok) throw new Error("Failed to fetch Pokemon list");
            
            const data = await response.json();
            
            const pokemons = data.results.map((pokemon, index) => {
                const id = index + 1;
                return {
                    id,
                    name: pokemon.name,
                    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                };
            });
            
            setPokemonList(pokemons);
            setFilteredList(pokemons);
            setTotalPages(Math.ceil(pokemons.length / ITEMS_PER_PAGE));
        } catch (error) {
            console.error("Error loading Pokemon list:", error);
            setError("Failed to load Pokemon list. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelectPokemon = (pokemon) => {
        const isInCollection = collectionPokemons.some(p => p.pokemon_id === pokemon.id);
        
        if (isInCollection) {
            setCollectionSelectedPokemons(prevSelected => {
                return prevSelected.some(p => p.id === pokemon.id)
                    ? prevSelected.filter(p => p.id !== pokemon.id)
                    : [...prevSelected, pokemon];
            });
        } else {
            setSelectedPokemons(prevSelected => {
                return prevSelected.some(p => p.id === pokemon.id)
                    ? prevSelected.filter(p => p.id !== pokemon.id)
                    : [...prevSelected, pokemon];
            });
        }
    };

    const changePage = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getCurrentPagePokemons = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredList.slice(startIndex, endIndex);
    };

    const addSelectedPokemonsToCollection = async () => {
        if (selectedPokemons.length === 0) {
            setError("Please select at least one Pokemon to add.");
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            const existingIds = collectionPokemons.map(p => p.pokemon_id);
            const newPokemons = selectedPokemons.filter(p => !existingIds.includes(p.id));
            
            if (newPokemons.length === 0) {
                setError("All selected Pokemon are already in your collection.");
                setIsLoading(false);
                return;
            }
            
            const addPromises = newPokemons.map(pokemon => 
                fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pokemonId: pokemon.id })
                })
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to add ${pokemon.name}`);
                    return response.json();
                })
            );
            
            const addedPokemons = await Promise.all(addPromises);
            
            setCollectionPokemons([...collectionPokemons, ...addedPokemons]);
            
            closeForm();
            
            alert(`Added ${addedPokemons.length} Pokemon to your collection!`);
        } catch (error) {
            console.error("Error adding Pokemon:", error);
            setError("Failed to add Pokemon. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeSelectedPokemonsFromCollection = async () => {
        if (collectionSelectedPokemons.length === 0) {
            setError("Please select at least one Pokemon to remove.");
            return;
        }
        
        if (!window.confirm(`Remove ${collectionSelectedPokemons.length} Pokemon from your collection?`)) {
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            const pokemonsToRemove = collectionSelectedPokemons
                .map(selected => {
                    const match = collectionPokemons.find(p => p.pokemon_id === selected.id);
                    return match ? { id: match.id, name: match.name } : null;
                })
                .filter(p => p !== null);
            
            if (pokemonsToRemove.length === 0) {
                setError("Selected Pokemon couldn't be found in your collection.");
                setIsLoading(false);
                return;
            }
            
            const deletePromises = pokemonsToRemove.map(pokemon => 
                fetch(`${API_URL}/${pokemon.id}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to remove ${pokemon.name}`);
                    return pokemon.id;
                })
            );
            
            const removedIds = await Promise.all(deletePromises);
            
            setCollectionPokemons(collectionPokemons.filter(pokemon => !removedIds.includes(pokemon.id)));
            
            closeForm();
            
            alert(`Removed ${removedIds.length} Pokemon from your collection.`);
        } catch (error) {
            console.error("Error removing Pokemon:", error);
            setError("Failed to remove Pokemon. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePokemon = async (id) => {
        if (!window.confirm("Remove this Pokemon from your collection?")) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                throw new Error("Failed to remove Pokemon");
            }
            
            setCollectionPokemons(collectionPokemons.filter(pokemon => pokemon.id !== id));
        } catch (error) {
            console.error("Error removing Pokemon:", error);
            setError("Failed to remove Pokemon. Please try again.");
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedPokemons([]);
        setCollectionSelectedPokemons([]);
        setError("");
        setSearchQuery("");
    };

    const renderPokemonSelector = () => {
        if (!isFormOpen) return null;
        
        return (
            <div className="pokemon-selector-overlay">
                <div className="pokemon-selector-container">
                    <h2>Select Pokemon</h2>
                    <p>Choose Pokemon to add to or remove from your collection</p>
                    
                    <div className="pokemon-search">
                        <input 
                            type="text" 
                            placeholder="Search by name or number..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {/* Selected to add summary */}
                    {renderSelectedSummary(selectedPokemons, "Selected to Add", "selected-to-add")}
                    
                    {/* Selected to remove summary */}
                    {renderSelectedSummary(collectionSelectedPokemons, "Selected to Remove", "selected-to-remove")}
                    
                    {/* Pokemon grid */}
                    {isLoading ? (
                        <div className="loading-indicator">Loading Pokemon list...</div>
                    ) : (
                        <>
                            <div className="pokemon-grid-selector">
                                {getCurrentPagePokemons().map(pokemon => renderPokemonGridItem(pokemon))}
                            </div>
                            
                            <div className="pagination">
                                <button onClick={() => changePage(1)} disabled={currentPage === 1}>⟨⟨</button>
                                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>⟨</button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>⟩</button>
                                <button onClick={() => changePage(totalPages)} disabled={currentPage === totalPages}>⟩⟩</button>
                            </div>
                        </>
                    )}
                    
                    {/* Action buttons */}
                    <div className="form-buttons">
                        <button 
                            type="button" 
                            className="save-button"
                            onClick={addSelectedPokemonsToCollection}
                            disabled={isLoading || selectedPokemons.length === 0}
                        >
                            {isLoading ? "Adding..." : `Add Selected (${selectedPokemons.length})`}
                        </button>
                        
                        <button 
                            type="button" 
                            className="remove-button"
                            onClick={removeSelectedPokemonsFromCollection}
                            disabled={isLoading || collectionSelectedPokemons.length === 0}
                        >
                            {isLoading ? "Removing..." : `Remove Selected (${collectionSelectedPokemons.length})`}
                        </button>
                        
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={closeForm}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderSelectedSummary = (selectedList, title, className) => {
        if (selectedList.length === 0) return null;
        
        return (
            <div className={`selected-pokemons ${className}`}>
                <h3>{title} ({selectedList.length})</h3>
                <div className="selected-pokemon-list">
                    {selectedList.map(pokemon => (
                        <div key={pokemon.id} className="selected-pokemon-item">
                            <img src={pokemon.sprite} alt={pokemon.name} />
                            <span>{pokemon.name}</span>
                            <button onClick={() => toggleSelectPokemon(pokemon)}>✕</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderPokemonGridItem = (pokemon) => {
        const isInCollection = collectionPokemons.some(p => p.pokemon_id === pokemon.id);
        const isSelectedToAdd = selectedPokemons.some(p => p.id === pokemon.id);
        const isSelectedToRemove = collectionSelectedPokemons.some(p => p.id === pokemon.id);
        
        return (
            <div 
                key={pokemon.id} 
                className={`pokemon-item 
                    ${isSelectedToAdd ? 'selected-add' : ''} 
                    ${isSelectedToRemove ? 'selected-remove' : ''} 
                    ${isInCollection ? 'in-collection' : ''}`}
                onClick={() => toggleSelectPokemon(pokemon)}
            >
                <img src={pokemon.sprite} alt={pokemon.name} />
                <div className="pokemon-item-name">
                    <span>#{pokemon.id}</span>
                    <span>{pokemon.name}</span>
                </div>
                {isInCollection && <div className="already-in-collection" title="Already in your collection">✓</div>}
            </div>
        );
    };
    
    const renderStatBar = (statName, value, maxValue = 255) => {
        return (
            <div className="stat">
                <span>{statName.toUpperCase()}:</span>
                <div className="stat-bar">
                    <div 
                        className="stat-fill" 
                        style={{ 
                            width: `${(value / maxValue) * 100}%`,
                            backgroundColor: statColors[statName.toLowerCase()]
                        }}
                    ></div>
                </div>
                <span className="stat-value">{value}</span>
            </div>
        );
    };
    
    const renderPokemonCard = (pokemon) => {
        const types = typeof pokemon.types === 'string' ? 
            JSON.parse(pokemon.types) : pokemon.types;
        
        return (
            <div key={pokemon.id} className="custom-pokemon-card">
                <div className="pokemon-card-header">
                    <h3>{pokemon.name.toUpperCase()} #{pokemon.pokemon_id}</h3>
                    <div className="pokemon-actions">
                        <button 
                            className={`favorite-button ${pokemon.is_favorite ? 'favorited' : ''}`}
                            onClick={() => toggleFavorite(pokemon.id, pokemon.is_favorite)}
                            title={pokemon.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                            {pokemon.is_favorite ? "⭐" : "☆"}
                        </button>
                        <button 
                            className="delete-button" 
                            onClick={() => deletePokemon(pokemon.id)}
                            title="Remove from Collection"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                
                <Link to={`/pokemon/${pokemon.pokemon_id}`} className="pokemon-image-link">
                    <img src={pokemon.image_url} alt={pokemon.name} />
                </Link>
                
                <div className="pokemon-types-container">
                    {types.map(type => (
                        <span 
                            key={type} 
                            className="type-badge"
                            style={{ backgroundColor: typeColors[type] }}
                        >
                            {type.toUpperCase()}
                        </span>
                    ))}
                </div>
                
                <div className="pokemon-stats">
                    {renderStatBar("HP", pokemon.hp)}
                    {renderStatBar("ATK", pokemon.attack)}
                    {renderStatBar("DEF", pokemon.defense)}
                    {renderStatBar("SPD", pokemon.speed)}
                </div>
                
                <div className="pokemon-details">
                    <div className="detail-row">
                        <span>Height:</span>
                        <span>{pokemon.height} m</span>
                    </div>
                    <div className="detail-row">
                        <span>Weight:</span>
                        <span>{pokemon.weight} kg</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="my-collection-container">
            <h1>My Collection</h1>
            <p className="collection-intro">
                Create your own Pokemon Collection.
            </p>
            
            <button 
                className="add-pokemon-button" 
                onClick={() => setIsFormOpen(true)}
            >
                + Add New Pokemon
            </button>
            
            {error && <div className="error-message">{error}</div>}
            
            {/* Pokemon selector popup */}
            {renderPokemonSelector()}
            
            {/* Loading indicator */}
            {isLoading && !isFormOpen && (
                <div className="loading-indicator">Loading...</div>
            )}
            
            {/* Collection grid */}
            <div className="pokemon-collection-grid">
                {collectionPokemons.length === 0 && !isLoading ? (
                    <p className="empty-collection">
                        There is no Pokemon in your collection. 
                        You can click on "Add New Pokemon".
                    </p>
                ) : (
                    collectionPokemons.map(pokemon => renderPokemonCard(pokemon))
                )}
            </div>
        </div>
    );
}

export default MyCollection;