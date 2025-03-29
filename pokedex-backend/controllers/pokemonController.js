const pool = require('../db');
const axios = require('axios');

exports.getAllPokemons = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons ORDER BY pokemon_id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Pokemon Data Fetching Error:', error);
    res.status(500).json({ error: 'Pokemon Data Couldnt Fetch' });
  }
};


exports.getPokemon = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon Couldnt Find' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Pokemon Data Fetching Error:', error);
    res.status(500).json({ error: 'Pokemon Data Couldnt Fetch' });
  }
};

exports.addPokemon = async (req, res) => {
  const { pokemonId } = req.body;
  
  if (!pokemonId) {
    return res.status(400).json({ error: 'Pokemon ID Needed' });
  }
  
  try {
    const [existingRows] = await pool.query('SELECT * FROM pokemons WHERE pokemon_id = ?', [pokemonId]);
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'This Pokemon Already in Your Collection' });
    }
    
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = response.data;
    
    const pokemon = {
      pokemon_id: pokemonData.id,
      name: pokemonData.name,
      image_url: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
      types: JSON.stringify(pokemonData.types.map(t => t.type.name)),
      hp: pokemonData.stats.find(s => s.stat.name === "hp").base_stat,
      attack: pokemonData.stats.find(s => s.stat.name === "attack").base_stat,
      defense: pokemonData.stats.find(s => s.stat.name === "defense").base_stat,
      speed: pokemonData.stats.find(s => s.stat.name === "speed").base_stat,
      height: pokemonData.height / 10, 
      weight: pokemonData.weight / 10, 
      is_favorite: false
    };
    
    const [result] = await pool.query(`
      INSERT INTO pokemons 
      (pokemon_id, name, image_url, types, hp, attack, defense, speed, height, weight, is_favorite) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pokemon.pokemon_id, 
      pokemon.name, 
      pokemon.image_url, 
      pokemon.types, 
      pokemon.hp, 
      pokemon.attack, 
      pokemon.defense, 
      pokemon.speed, 
      pokemon.height, 
      pokemon.weight, 
      pokemon.is_favorite
    ]);
    

    const [newPokemon] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [result.insertId]);
    res.status(201).json(newPokemon[0]);
  } catch (error) {
    console.error('Pokemon Adding Error:', error);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: `Pokemon ID: ${pokemonId} Couldnt Find` });
    }
    
    res.status(500).json({ error: 'Pokemon Couldnt Added' });
  }
};

exports.updatePokemon = async (req, res) => {
  const { id } = req.params;
  const { is_favorite } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon Couldnt Find' });
    }
    
    await pool.query('UPDATE pokemons SET is_favorite = ? WHERE id = ?', [is_favorite, id]);
    
    const [updatedPokemon] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [id]);
    res.json(updatedPokemon[0]);
  } catch (error) {
    console.error('Pokemon Update Error:', error);
    res.status(500).json({ error: 'Pokemon Couldnt Updated' });
  }
};

exports.deletePokemon = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon Couldnt Find' });
    }
    
    await pool.query('DELETE FROM pokemons WHERE id = ?', [id]);
    
    res.json({ message: 'Pokemon Succesfully Deleted', id });
  } catch (error) {
    console.error('Pokemon Deleting Error:', error);
    res.status(500).json({ error: 'Pokemon Couldnt deleted' });
  }
};