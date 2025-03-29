import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./PokemonList.css";

const generations = [
    { name: "Gen 1", start: 1, end: 151 },
    { name: "Gen 2", start: 152, end: 251 },
    { name: "Gen 3", start: 252, end: 386 },
    { name: "Gen 4", start: 387, end: 493 },
    { name: "Gen 5", start: 494, end: 649 },
    { name: "Gen 6", start: 650, end: 721 },
    { name: "Gen 7", start: 722, end: 809 },
    { name: "Gen 8", start: 810, end: 905 },
    { name: "Gen 9", start: 906, end: 1025 },
];

function PokemonList({ toggleFavorite, favorites }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [activeGen, setActiveGen] = useState(0); 
    const limit = 20;
    const observer = useRef();

    const currentGen = generations[activeGen];

    useEffect(() => {
        setPokemonList([]); 
        setOffset(0);
    }, [activeGen]);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
            .then((response) => response.json())
            .then((data) => {
                const promises = data.results.map((pokemon) =>
                    fetch(pokemon.url).then((res) => res.json())
                );

                Promise.all(promises).then((pokemonData) => {
                    const filteredPokemon = pokemonData.filter(
                        (p) => p.id >= currentGen.start && p.id <= currentGen.end
                    );

                    setPokemonList((prevList) => [
                        ...prevList.filter(p => !filteredPokemon.some(newP => newP.id === p.id)),
                        ...filteredPokemon
                    ]);
                });
            });
    }, [offset, activeGen]);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setOffset((prevOffset) => prevOffset + limit);
            }
        });

        const loadMoreTrigger = document.getElementById("load-more-trigger");
        if (loadMoreTrigger) observer.current.observe(loadMoreTrigger);

        return () => {
            if (loadMoreTrigger) observer.current.unobserve(loadMoreTrigger);
        };
    }, [pokemonList]);

    return (
        <div>
            {/* Gen Tabs */}
            <div className="generation-tabs">
                {generations.map((gen, index) => (
                    <button
                        key={gen.name}
                        className={index === activeGen ? "active" : ""}
                        onClick={() => setActiveGen(index)}
                    >
                        {gen.name}
                    </button>
                ))}
            </div>

            {/* Pokemon List */}
            <div className="pokemon-grid">
                {pokemonList.map((pokemon) => {
                    const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
                    return (
                        <div key={pokemon.id} className="pokemon-card">
                            <span
                                className={`favorite-star ${isFavorite ? "favorited" : ""}`}
                                onClick={() => toggleFavorite({ name: pokemon.name, id: pokemon.id, types: pokemon.types })}
                            >
                                {isFavorite ? "⭐" : "🟊"}
                            </span>
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                                <h3>{pokemon.name.toUpperCase()}</h3>
                                <div className="pokemon-types">
                                    {pokemon.types.map((typeInfo) => (
                                        <span key={typeInfo.type.name} className={`type ${typeInfo.type.name}`}>
                                            {typeInfo.type.name}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div id="load-more-trigger" style={{ height: "20px" }}></div>
        </div>
    );
}

export default PokemonList;
