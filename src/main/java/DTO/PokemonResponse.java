package DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PokemonResponse {
    private int id;
    private String name;
    private int height;
    private int weight;
    private List<PokemonDetail.TypeWrapper> types;
    private PokemonDetail.Sprite sprites;
    private List<GameIndex> gameIndices;
    private List<String> games;
    private String evolutionChain;

    public List<String> getGames() {
        return games;
    }

    public void setGames(List<String> games) {
        this.games = games;
    }

    public String getEvolutionChain() {
        return evolutionChain;
    }

    public void setEvolutionChain(String evolutionChain) {
        this.evolutionChain = evolutionChain;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public List<PokemonDetail.TypeWrapper> getTypes() {
        return types;
    }

    public void setTypes(List<PokemonDetail.TypeWrapper> types) {
        this.types = types;
    }

    public PokemonDetail.Sprite getSprites() {
        return sprites;
    }

    public void setSprites(PokemonDetail.Sprite sprites) {
        this.sprites = sprites;
    }

    public List<GameIndex> getGameIndices() {
        return gameIndices;
    }

    public void setGameIndices(List<GameIndex> gameIndices) {
        this.gameIndices = gameIndices;
    }
}