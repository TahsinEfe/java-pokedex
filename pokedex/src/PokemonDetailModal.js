import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Modal.css";

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

const PokemonDetailModal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            setPokemon({
                id: res.data.id,
                name: res.data.name,
                image: res.data.sprites.front_default,
                types: res.data.types.map((t) => t.type.name),
                height: res.data.height,
                weight: res.data.weight
            });
        };
        fetchData();
    }, [id]);

    if (!pokemon) return null;

    return (
        <div className="modal-overlay" onClick={() => navigate("/")}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => navigate("/")}>❌</button>
                <img src={pokemon.image} alt={pokemon.name} />
                <h2>{pokemon.name.toUpperCase()}</h2>
                <p>Height: {pokemon.height} | Weight: {pokemon.weight}</p>
                <div className="type-container">
                    {pokemon.types.map((type) => (
                        <span
                            key={type}
                            className="type-badge"
                            style={{ backgroundColor: typeColors[type] }}
                        >
                            {type.toUpperCase()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokemonDetailModal;
