package controller;

import DTO.PokemonListResponse;
import org.springframework.web.bind.annotation.*;
import service.PokemonService;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {
    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService){
        this.pokemonService = pokemonService;
    }

    @GetMapping
    public PokemonListResponse getAllPokemon(){
        return pokemonService.getPokemonList();
    }
}
