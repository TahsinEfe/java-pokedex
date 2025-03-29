const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pokemonRoutes = require('./routes/pokemon');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/pokemons', pokemonRoutes);

app.get('/', (req, res) => {
  res.send('Pokedex API is working!');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} is running`);
});