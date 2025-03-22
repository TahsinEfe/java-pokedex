package DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Species {

    private String name;

    @JsonProperty("evolution_chain")
    private EvolutionChainUrl evolutionChain;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EvolutionChainUrl getEvolutionChain() {
        return evolutionChain;
    }

    public void setEvolutionChain(EvolutionChainUrl evolutionChain) {
        this.evolutionChain = evolutionChain;
    }
}