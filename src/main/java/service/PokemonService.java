package service;

import DTO.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PokemonService {

    private final RestTemplate restTemplate;

    public PokemonService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PokemonResponse getPokemonData(String name) {
        System.out.println("Fetching data for: " + name);

        String url = "https://pokeapi.co/api/v2/pokemon/" + name;
        PokemonResponse pokemon;

        try {
            pokemon = restTemplate.getForObject(url, PokemonResponse.class);
        } catch (Exception e) {
            System.err.println("Error fetching Pokémon data: " + e.getMessage());
            return null;
        }

        if (pokemon == null) {
            System.out.println("Pokemon not found: " + name);
            return null;
        }

        if (pokemon.getGameIndices() != null) {
            List<String> gameNames = pokemon.getGameIndices().stream()
                    .map(gameIndex -> Optional.ofNullable(gameIndex.getVersion())
                            .map(Version::getName)
                            .orElse("Unknown Version"))
                    .collect(Collectors.toList());

            pokemon.setGames(gameNames);
            System.out.println("Games: " + gameNames);
        } else {
            System.out.println("Game indices are null");
        }

        String speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + name;
        Species species;
        try {
            species = restTemplate.getForObject(speciesUrl, Species.class);
        } catch (Exception e) {
            System.err.println("Error fetching species data: " + e.getMessage());
            return pokemon;
        }

        if (species != null && species.getEvolutionChain() != null) {
            String evolutionChainUrl = species.getEvolutionChain().getUrl();
            EvolutionChainResponse evolutionChain;
            try {
                evolutionChain = restTemplate.getForObject(evolutionChainUrl, EvolutionChainResponse.class);
            } catch (Exception e) {
                System.err.println("Error fetching evolution chain: " + e.getMessage());
                return pokemon;
            }

            String evolutionChainData = parseEvolutionChain(evolutionChain);
            pokemon.setEvolutionChain(evolutionChainData);
        } else {
            System.out.println("Species or evolution chain is null");
        }

        return pokemon;
    }

    private String parseEvolutionChain(EvolutionChainResponse evolutionChain) {
        if (evolutionChain == null || evolutionChain.getChain() == null) return "No evolution data";

        StringBuilder evolutionPath = new StringBuilder();
        EvolutionDetail current = evolutionChain.getChain();

        while (current != null) {
            evolutionPath.append(current.getSpecies().getName()).append(" -> ");
            if (current.getEvolvesTo() == null || current.getEvolvesTo().isEmpty()) break;
            current = current.getEvolvesTo().get(0);
        }

        return evolutionPath.length() > 4 ? evolutionPath.substring(0, evolutionPath.length() - 4) : "No evolution data";
    }
}