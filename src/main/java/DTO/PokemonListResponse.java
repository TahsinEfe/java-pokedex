package DTO;

import java.util.List;

public class PokemonListResponse {
    private int count;
    private List<Pokemon> results;

    public int getCount(){ return count; }
    public List<Pokemon> getResults() { return results;}
}

