package controller;

import DTO.PokemonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.PokemonService;


@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {
    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping("/{name}")
    public ResponseEntity<PokemonResponse> getPokemonByName(@PathVariable String name) {
        System.out.println("Fetching Pokémon by name: " + name);
        return ResponseEntity.ok(pokemonService.getPokemonData(name));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<PokemonResponse> getPokemonById(@PathVariable int id) {
        System.out.println("Fetching Pokémon by ID: " + id);
        return ResponseEntity.ok(pokemonService.getPokemonData(String.valueOf(id)));
    }
}