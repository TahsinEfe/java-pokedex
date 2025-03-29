# Java Pokédex

A full-stack Pokémon application that allows users to browse Pokémon, create personal collections, and manage favorites using React, Node.js, and MySQL.

![Pokémon Logo](https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg)

## Features
- **Pokédex:** Browse through all Pokémon with details and statistics
- **Personal Collection:** Add Pokémon to your personal collection stored in a MySQL database
- **Favorites:** Mark Pokémon as favorites for quick access
- **Search & Filter:** Find Pokémon by name, ID, or type
- **Detailed View:** See comprehensive information about each Pokémon
- **Responsive Design:** Works on desktop and mobile devices

## Technologies Used
- **Frontend:** React.js, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **External API:** PokeAPI

## Installation and Setup

### Prerequisites
Make sure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Database Setup
Create a MySQL database:
```sql
CREATE DATABASE pokedex;
USE pokedex;

CREATE TABLE pokemons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pokemon_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    types JSON NOT NULL,
    hp INT NOT NULL,
    attack INT NOT NULL,
    defense INT NOT NULL,
    speed INT NOT NULL,
    height FLOAT,
    weight FLOAT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend Setup
Clone the repository and set up the backend:
```sh
git clone https://github.com/TahsinEfe/java-pokedex.git
cd java-pokedex

mkdir pokedex-backend
cd pokedex-backend
npm init -y
npm install express mysql2 cors dotenv axios
```
Create a `.env` file in the `pokedex-backend` directory:
```ini
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=pokedex
```
Start the backend server:
```sh
node server.js
```

### Frontend Setup
Navigate to the frontend directory:
```sh
cd ../pokedex
npm install
npm start
```
The application should now be running at [http://localhost:3000](http://localhost:3000)

## Project Structure
```
java-pokedex/
├── pokedex/                  # Frontend React application
│   ├── public/               # Static files
│   └── src/                  # React source files
│       ├── App.js            # Main application component
│       ├── PokemonList.js    # Pokemon list component
│       ├── PokemonDetail.js  # Pokemon detail component
│       ├── Favorite.js       # Favorites component
│       ├── MyCollection.js   # Collection management component
│       └── ...
├── pokedex-backend/          # Backend Node.js application
│   ├── server.js             # Express server setup
│   ├── db.js                 # Database connection
│   ├── routes/               # API routes
│   └── controllers/          # Request handlers
└── README.md
```

## API Endpoints
The backend provides the following API endpoints:

- `GET /api/pokemons` - Get all Pokémon in the collection
- `GET /api/pokemons/:id` - Get a specific Pokémon by database ID
- `POST /api/pokemons` - Add a new Pokémon to the collection (requires `pokemonId` in request body)
- `PUT /api/pokemons/:id` - Update a Pokémon (currently used for toggling favorite status)
- `DELETE /api/pokemons/:id` - Remove a Pokémon from the collection

## Usage
- **Browse Pokémon:** Navigate to the home page to see all Pokémon from the PokeAPI
- **View Pokémon Details:** Click on any Pokémon to see its detailed statistics
- **Add to Collection:**
  - Go to "My Collection" page
  - Click "+ Add New Pokemon"
  - Select Pokémon from the visual list
  - Click "Add Selected"
- **Manage Favorites:**
  - Click the star icon on any Pokémon card to add/remove from favorites
  - View all favorites in the "Favorites" section
- **Remove from Collection:**
  - In "My Collection", select Pokémon you want to remove
  - Click "Remove Selected"

## Screenshots
(Add screenshots of your application here)

## Contributing
1. Fork the repository
2. Create a feature branch:  
   ```sh
   git checkout -b feature/new-feature
   ```
3. Commit your changes:  
   ```sh
   git commit -m 'Add new feature'
   ```
4. Push to the branch:  
   ```sh
   git push origin feature/new-feature
   ```
5. Open a Pull Request

## Acknowledgements
- [PokeAPI](https://pokeapi.co/) for providing Pokémon data
- Pokémon for the inspiration and characters

## Contact
**Tahsin Efe** - [GitHub Profile](https://github.com/TahsinEfe)

**Project Link:** [https://github.com/TahsinEfe/java-pokedex](https://github.com/TahsinEfe/java-pokedex)

