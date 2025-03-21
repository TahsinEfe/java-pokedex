package service;

import DTO.PokemonListResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PokemonService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=1302";

    public PokemonListResponse getPokemonList(){
        return restTemplate.getForObject(apiUrl, PokemonListResponse.class);
    }


}
